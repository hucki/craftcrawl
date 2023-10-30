export const AuthButton = ({
  type,
  name,
  value,
  onClick,
  children,
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      name={name}
      type={type}
      value={value}
      onClick={onClick}
      className="rounded-xl bg-amber-300 px-3 py-2 transition duration-300 ease-in-out hover:bg-amber-200 hover:-translate-y-1"
    >
      {children}
    </button>
  );
};
