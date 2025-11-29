import LoginHero from "../../../sections/login/LoginHero";
import FormLogin from "../../../sections/login/formlogin";

const LoginPage = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-1 flex-col md:flex-row items-center px-4 md:px-8 justify-center gap-6 md:gap-12 w-full py-8">
          <LoginHero />
          <FormLogin />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
