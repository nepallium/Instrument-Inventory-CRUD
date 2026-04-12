export default function () {
  return (
    process.argv[2].includes("localhost") ||
    process.argv[2].includes("127.0.0.1")
  );
}
