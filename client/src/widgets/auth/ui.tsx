import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui/tabs";
import { LoginForm } from "features/login";
import { SignupForm } from "features/sign-up";

export const Auth = () => {
  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2 h-11 mb-6">
        <TabsTrigger value="login">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      <TabsContent value="signup">
        <SignupForm />
      </TabsContent>
    </Tabs>
  );
};
