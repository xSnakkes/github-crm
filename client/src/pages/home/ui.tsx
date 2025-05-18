import { useAuthStore } from "entities/user";
import { RepositoryList } from "widgets/repository-list";

export const HomePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  console.log("user", user);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Hi, {user?.firstName} {user?.lastName} ✌️
      </h1>
      <RepositoryList />
    </div>
  );
};
