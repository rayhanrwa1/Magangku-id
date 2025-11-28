import Navbar from "../../../layout/navbarlogin";
import LoginHero from "../../../sections/login/LoginHero";
import FormLogin from "../../../sections/login/formlogin";
import Footer from "../../../layout/footer";

const LoginPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex flex-1 flex-col md:flex-row items-center px-4 md:px-8 justify-center gap-6 md:gap-8 w-full">
          <LoginHero />
          <FormLogin />
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
