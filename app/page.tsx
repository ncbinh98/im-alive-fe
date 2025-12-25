import Button from "@mui/material/Button";
import Hello from "../components/hello";

export default function Home() {
  console.log("im sever?");
  return (
    <div>
      <Button variant="contained">Hello world</Button>
      <Hello/>
    </div>
  );
}
