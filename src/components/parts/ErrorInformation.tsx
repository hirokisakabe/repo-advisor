import { Center } from "./Center";

export function ErrorInformation({ error }: { error: Error }) {
  return (
    <Center>
      <div>Error: {error.message}</div>
    </Center>
  );
}
