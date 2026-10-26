export type ReflectionVariant = "threshold" | "memory" | "choice" | "silence" | "release";

const variants: Record<ReflectionVariant, number> = {
  threshold: 0, memory: 1, choice: 2, silence: 3, release: 4,
};

// Light is made from soft, horizontally stretched folds. The broad glow and
// narrow reflected edge move together; texture stays on the stationary plane.
export function reflectionShader(variant: ReflectionVariant) {
  return `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
const int SCENE = ${variants[variant]};
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
}
float soft(float d, float width) { return exp(-pow(d/width,2.0)); }
float veil(vec2 p, vec2 center, vec2 size) { vec2 d=(p-center)/size; return exp(-dot(d,d)); }
void main() {
  vec2 p=gl_FragCoord.xy/u_resolution; p.y=1.-p.y;
  float t=u_time*.15;
  // Bounded, asymmetric drift with much less vertical than horizontal motion.
  p.x += .035*sin(t*.71+p.y*2.)+.018*sin(t*1.13+2.4);
  p.y += .006*sin(t*.93+p.x*3.)+.004*sin(t*.57+1.7);
  float n=noise(vec2(p.x*3.5+t*.18,p.y*6.-t*.08));
  float fold=0., haze=0., warm=0., shadow=0.;
  if (SCENE == 0) {
    // A lit horizon closed by an overhanging charcoal fold.
    float line=.56+.045*sin(p.x*4.+.4)+.025*n;
    float taper=smoothstep(.34,.64,p.x)*(1.-smoothstep(.94,1.3,p.x));
    fold=soft(p.y-line,.017+.025*smoothstep(.4,1.,p.x))*taper;
    haze=veil(p,vec2(.86,.38),vec2(.43,.24))*.58;
    shadow=soft(p.y-line+.065,.06)*taper;
    warm=soft(p.y-line-.045,.075)*taper*.45;
  } else if (SCENE == 1) {
    // Two exposures of the same interval, slightly out of register.
    float wave=.80+.045*sin(p.x*5.)+.025*n;
    float a=soft(p.y-wave,.022)*veil(p,vec2(.22,.70),vec2(.29,.24));
    float b=soft(p.y-wave+.08,.035)*veil(p,vec2(.80,.56),vec2(.35,.29));
    fold=.72*a+.9*b;
    haze=.35*veil(p,vec2(.28,.85),vec2(.36,.20))+.45*veil(p,vec2(.86,.74),vec2(.34,.23));
    warm=soft(p.y-wave-.05,.07)*veil(p,vec2(.65,.73),vec2(.52,.24))*.34;
  } else if (SCENE == 2) {
    // A split beam opens into several possible paths.
    float x=p.x-.25;
    float line=.79-.06*x+.018*n;
    float separation=.065*smoothstep(.28,.93,p.x);
    float taper=smoothstep(.18,.57,p.x)*(1.-smoothstep(.90,1.3,p.x));
    fold=(soft(p.y-line-separation,.027)+.72*soft(p.y-line+separation,.021))*taper*.7;
    haze=.45*veil(p,vec2(.93,.55),vec2(.40,.33));
    shadow=soft(p.y-line,.024)*taper*.7;
    warm=soft(p.y-line-.09,.10)*taper*.4;
  } else if (SCENE == 3) {
    // An open, low horizon. More air, less visual activity.
    float line=.61+.085*sin(p.x*3.4+.2)+.028*n;
    float taper=smoothstep(.32,.70,p.x);
    fold=soft(p.y-line,.035+.025*p.x)*taper*.62;
    haze=veil(p,vec2(.97,.41),vec2(.50,.38))*.7;
    shadow=soft(p.y-line+.09,.09)*taper*.55;
    warm=soft(p.y-line-.10,.13)*taper*.3;
  } else {
    // The last exposure opens upward; the words sit in its quiet centre.
    float edge=.26+.15*sin(p.x*3.6+.25)+.025*n;
    haze=(1.-smoothstep(edge-.15,edge+.14,p.y))*.85;
    haze*=.35+.65*soft(p.x-.68,.6);
    float line=.77+.065*sin(p.x*4.3)+.02*n;
    fold=soft(p.y-line,.025+.016*p.x)*smoothstep(.30,.68,p.x)*.64;
    warm=soft(p.y-line-.055,.095)*smoothstep(.25,.7,p.x)*.35;
  }
  vec3 base=vec3(10.,11.,10.)/255.;
  vec3 color=mix(base,vec3(66.,78.,73.)/255.,clamp(haze,0.,1.));
  color=mix(color,base,clamp(shadow*.55,0.,.75));
  color=mix(color,vec3(61.,48.,36.)/255.,clamp(warm,0.,.5));
  color=mix(color,vec3(101.,112.,102.)/255.,clamp(fold*.76,0.,.85));
  // Broad optical falloff, no bright frame at the section boundary.
  float edgeFade=smoothstep(0.,.12,p.y)*(1.-smoothstep(.86,1.,p.y));
  color=mix(base,color,edgeFade);
  gl_FragColor=vec4(color,1.);
}`;
}
