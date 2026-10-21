import {
  PrimaryAction,
  SecondaryAction,
  SkipAction,
  DestructiveAction,
  PauseAction,
} from "./Actions";
import { SourceMarker } from "./Shared";
import { SerifAccent } from "./EditorialType";
import EditorialText from "./EditorialText";
export default function StyleGuide() {
  return (
    <main>
      {["light", "dark"].map((theme) => (
        <section key={theme} className={`section style-guide ${theme}`}>
          <h1 className="display">
            <SerifAccent>Пауза</SerifAccent>
          </h1>
          {[
            "section-title",
            "lead",
            "body-large",
            "body",
            "instruction",
            "system-status",
            "meta",
            "caption",
          ].map((role) => (
            <p className={role} key={role}>
              {role} / Человек распоряжается своим временем.
            </p>
          ))}
          <SourceMarker numbers="1" />
          <div className="style-guide-prose">
            <p className="meta">GOOD PARAGRAPH / СМЫСЛОВОЙ БЛОК</p>
            <EditorialText
              blocks={[
                {
                  type: "paragraph",
                  text: "Система могла обработать 99 из 100 файлов. Но последний оказался самым большим. Или основная операция закончилась, а теперь нужно проверить результат. Процент выполненной работы и процент прошедшего времени — не обязательно одно и то же.",
                },
                {
                  type: "paragraph",
                  text: "Поэтому интерфейсу стоит объяснять, что происходит. Такое сообщение помогает человеку решить, оставаться ли у экрана или заняться другим делом. [3]",
                },
                { type: "quote", text: "Вам не нужно оставаться здесь." },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Объяснить состояние процесса.",
                    "Показать надёжность прогноза.",
                    "Оставить возможность уйти.",
                  ],
                },
              ]}
            />
          </div>
          <div className="actions">
            <PrimaryAction>Начать</PrimaryAction>
            <SecondaryAction>Повторить</SecondaryAction>
            <SkipAction>Пропустить</SkipAction>
            <DestructiveAction>Отменить</DestructiveAction>
            <PauseAction>Пауза</PauseAction>
            <PrimaryAction disabled>Недоступно</PrimaryAction>
          </div>
          <p className="caption">
            Tab — focus-visible; наведение — hover; удержание — active. На узком
            экране элементы перестраиваются.
          </p>
        </section>
      ))}
    </main>
  );
}
