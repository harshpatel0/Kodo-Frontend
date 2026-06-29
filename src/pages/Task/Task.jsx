import Background from "../../components/Background/Background";
import Header from "../../components/Header/Header";
import Heading from "../../components/Heading/Heading";

export default function Task() {
  return (
    <>
      <Background />
      <Heading component={<Header />} />
    </>
  );
}
