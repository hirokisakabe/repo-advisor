import { Center } from "./Center";

export function ErrorInformation({ message }: { message: string }) {
  return (
    <Center>
      <div>Error: {message}</div>
    </Center>
  );
}
