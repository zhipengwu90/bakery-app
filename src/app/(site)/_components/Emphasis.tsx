import { splitEmphasis } from "@/lib/content/format";

/** Renders owner-written text where "*words*" become italic poppy-red. */
export default function Emphasis({ text }: { text: string }) {
  return (
    <>
      {splitEmphasis(text).map((p, i) =>
        p.em ? (
          <em key={i} className="font-normal italic text-poppy">
            {p.text}
          </em>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}
