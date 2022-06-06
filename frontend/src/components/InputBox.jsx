import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InputBox({
  placeholder,
  icon,
  title,
  id,
  type,
  error,
}) {
  return (
    <>
      {title && (
        <h3
          className={`w-full text-lg mt-2 ${
            error ? "text-red-600" : "text-white"
          }`}
        >
          {error ? title + " - " + error : title}
        </h3>
      )}
      <div
        className={
          "w-full flex items-center justify-center bg-messageBox h-10 rounded-lg"
        }
      >
        {icon && (
          <FontAwesomeIcon className="p-3 text-xl text-iconsBase" icon={icon} />
        )}
        <input
          id={id}
          className="grow h-full rounded-lg px-2 bg-messageBox focus:outline-none"
          name="username"
          placeholder={placeholder}
          type={type ? type : "text"}
        />
      </div>
    </>
  );
}
