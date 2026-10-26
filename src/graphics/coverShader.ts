import { coverParameters as p } from "./coverParameters";
const f = (v: number) => Number.isInteger(v) ? `${v}.0` : String(v);
const v2 = (a: readonly number[]) => `vec2(${a.map(f).join(",")})`;
const rgb = (a: readonly number[]) => `vec3(${a.map(f).join(",")}) / 255.0`;
// Generated constant segments avoid dynamically indexing uniform arrays in WebGL 1.
function curve(name: string, values: readonly number[]) {
  return `float ${name}(float x) {
    float s = clamp(x, 0.0, 0.99999) * ${f(values.length - 1)};
    float t = fract(s);
    ${values.slice(0, -1).map((_, i) => {
      const a = values[Math.max(0, i - 1)], b = values[i], c = values[i + 1], d = values[Math.min(values.length - 1, i + 2)];
      return `if (s < ${f(i + 1)}) return 0.5 * ((2.0 * ${f(b)}) + (${f(-a + c)}) * t + (${f(2*a - 5*b + 4*c - d)}) * t*t + (${f(-a + 3*b - 3*c + d)}) * t*t*t);`;
    }).join("\n")}
    return ${f(values.at(-1)!)};
  }`;
}
export const vertexShader = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
export const fragmentShader = `precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
float hash(vec3 p) {
  p = fract(p * 0.1031 + ${f(p.motion.seed)});
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
// Offset time domains prevent both noise fields from flattening at integer times.
// Sine expands the useful middle range, while keeping the output bounded to [-1,1].
float flow(vec2 point, float time) {
  float a = noise(vec3(point, time + 0.37));
  float b = noise(vec3(point*0.73 + vec2(7.3,11.8), time*0.81 + 5.63));
  return sin((0.62*a + 0.38*b - 0.5)*3.14159265);
}
${curve("upperEdge", p.upper.edge)}
${curve("upperSoft", p.upper.softness)}
${curve("ribbonBend", p.ribbon.bend)}
${curve("ribbonWidth", p.ribbon.halfWidth)}
${curve("ribbonSoft", p.ribbon.softness)}
float bell(vec2 q, vec2 centre, vec2 size) {
  vec2 d = (q-centre)/size;
  return exp(-dot(d,d)*2.0);
}
void main() {
  vec2 uv = vec2(gl_FragCoord.x, u_resolution.y-gl_FragCoord.y)/u_resolution;
  vec2 q = uv;
  // Crop the scene horizontally on portrait screens instead of squeezing its forms.
  float span = clamp((u_resolution.x/u_resolution.y)/${f(p.render.referenceAspect)},${f(p.render.minHorizontalSpan)},1.0);
  q.x = (q.x-0.5)*span+0.5;
  vec2 n = q * ${v2(p.motion.spatialScale)};
  float t = u_time * ${f(p.motion.speed)};
  // Bounded local deformation, with the art-directed still frame at time zero.
  q.x += ${f(p.motion.horizontalPx / 1440)} * 0.5 * (flow(n,t)-flow(n,0.0));
  q.y += ${f(p.motion.verticalPx / 900)} * 0.5 * (flow(n+17.0,t)-flow(n+17.0,0.0));
  float detail = (noise(vec3(q.x*19.0,q.y*8.0,4.0))-0.5) * ${f(p.upper.contourDetailPx / 900)};
  float edge = upperEdge(q.x) + detail;
  float soft = upperSoft(q.x);
  float upper = 1.0 - smoothstep(edge-soft,edge+soft,q.y);
  float modelling = 0.82 + 0.18*cos((q.x-0.48)*4.4);
  modelling *= 0.91 + 0.09*noise(vec3(q*vec2(7.0,14.0),1.0));
  modelling *= 1.0 - ${f(p.upper.leftShade.intensity)}*bell(q,${v2(p.upper.leftShade.center)},${v2(p.upper.leftShade.size)});
  // Slightly sharper shelf and dark recess, not a uniform blur over the whole image.
  float fold = bell(q,${v2(p.fold.center)},${v2(p.fold.size)}) * ${f(p.fold.intensity)};
  vec3 base = ${rgb(p.base)};
  vec3 edgeColor = mix(${rgb(p.upper.color)},${rgb(p.upper.edgeColor)},(1.0-upper)*${f(p.upper.edgeWarmth)});
  vec3 color = mix(base,edgeColor,upper * modelling * (1.0-fold) * ${f(p.upper.intensity)});
  float tail = bell(q,${v2(p.tail.center)},${v2(p.tail.size)}) * ${f(p.tail.intensity)};
  color = mix(color, max(color,${rgb(p.tail.color)}),tail);
  color = mix(color,max(color,${rgb(p.ribbon.warmAfterglow.color)}),bell(q,${v2(p.ribbon.warmAfterglow.center)},${v2(p.ribbon.warmAfterglow.size)})*${f(p.ribbon.warmAfterglow.intensity)});
  float along = (q.x-${f(p.ribbon.x[0])})/${f(p.ribbon.x[1]-p.ribbon.x[0])};
  float taper = smoothstep(0.0,0.22,along)*(1.0-smoothstep(0.61,1.0,along));
  float lineY = ${f(p.ribbon.y)} + ribbonBend(along);
  float width = max(0.0001,ribbonWidth(along));
  float feather = max(0.001,ribbonSoft(along));
  float distance = abs(q.y-lineY);
  float halo = exp(-pow(distance/${f(p.ribbon.haloWidth)},2.0)) * taper;
  color = mix(color,${rgb(p.ribbon.haloColor)},halo*${f(p.ribbon.haloIntensity)});
  float merge = smoothstep(${f(p.ribbon.fork.mergeStart)},${f(p.ribbon.fork.mergeEnd)},along);
  float gap = ${f(p.ribbon.fork.separation)}*(1.0-merge);
  float branchWidth = width*mix(0.45,1.0,merge);
  float branchFeather = mix(min(feather,${f(p.ribbon.fork.tipSoftness)}),feather,merge);
  float nearEdge = max(0.0,branchWidth-branchFeather);
  float farEdge = branchWidth+branchFeather;
  float upperTip = 1.0-smoothstep(nearEdge,farEdge,abs(q.y-(lineY-gap*0.35)));
  float lowerTip = 1.0-smoothstep(nearEdge,farEdge,abs(q.y-(lineY+gap*0.65)));
  lowerTip *= smoothstep(${f(p.ribbon.fork.lowerStart)},0.22,along)*mix(${f(p.ribbon.fork.lowerIntensity)},1.0,merge);
  // Union keeps the two tips from doubling the brightness where they join.
  float ribbon = max(upperTip,lowerTip)*taper;
  color = mix(color,${rgb(p.ribbon.color)},ribbon*${f(p.ribbon.intensity)});
  gl_FragColor = vec4(color,1.0);
}`;

export function createCoverRenderer(canvas: HTMLCanvasElement, fragmentSource = fragmentShader) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!program || !buffer) return null;
  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexShader], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Cannot create cover shader");
      shaders.push(shader);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || "Cover shader compilation failed");
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "Cover shader linking failed");
  } catch (error) {
    shaders.forEach(shader => gl.deleteShader(shader));
    gl.deleteProgram(program); gl.deleteBuffer(buffer);
    console.warn("Procedural cover unavailable", error);
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  return {
    draw(phase: number) {
      const ratio = Math.min(devicePixelRatio || 1, p.render.maxPixelRatio);
      const width = Math.max(1, Math.round(canvas.clientWidth*ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight*ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0,0,width,height);
      gl.uniform2f(resolution,width,height); gl.uniform1f(time,phase);
      gl.drawArrays(gl.TRIANGLES,0,6);
    },
    dispose() { shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); gl.deleteBuffer(buffer); },
  };
}
