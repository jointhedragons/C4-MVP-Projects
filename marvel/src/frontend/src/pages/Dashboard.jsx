import { useQuery } from "@tanstack/react-query";
import { main } from "../services";

function Dashboard() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["response"],
    queryFn: main,
  });
  if (isLoading) return;
  console.log(data);
  return <div></div>;
}

export default Dashboard;
