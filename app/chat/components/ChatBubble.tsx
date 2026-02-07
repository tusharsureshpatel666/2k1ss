import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({
  text,
  isMine,
  isFirst,
  isLast,
  time,
  seen,
}: {
  text: string;
  isMine: boolean;
  isFirst: boolean;
  isLast: boolean;
  time: string;
  seen: boolean;
}) {
  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      } ${isFirst ? "mt-3" : "mt-1"}`}
    >
      <div
        className={`
          max-w-[70%] px-3 py-2 text-sm shadow
          ${isMine ? "bg-[#005c4b] text-white" : "bg-white text-black"}

          ${
            isMine
              ? isFirst
                ? "rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                : "rounded-lg"
              : isFirst
                ? "rounded-tr-lg rounded-tl-lg rounded-br-lg"
                : "rounded-lg"
          }

          ${isLast ? "" : "rounded-b-none"}
        `}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>

        {isLast && (
          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
            <span>{time}</span>

            {isMine &&
              (seen ? (
                <CheckCheck className="h-3 w-3 text-blue-400" />
              ) : (
                <Check className="h-3 w-3" />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
