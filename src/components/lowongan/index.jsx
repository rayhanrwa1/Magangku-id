import Navbar from "../../layout/navbar";
import HeaderSearch from "../../sections/lowongan/headersearch";
import ListLowongan from "../../sections/lowongan/listlowongancard";
import Footer from "../../layout/footer";

export default function LowonganPage() {

  return (
    <>
      <Navbar />
      <HeaderSearch />

      <div className="px-4 lg:px-12 mt-6 mb-20">
        <ListLowongan />
      </div>

      <Footer />
    </>
  );
}
