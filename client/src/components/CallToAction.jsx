import { Button } from "flowbite-react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-lime-600 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl font-bold mb-2 text-gray-500">Ingin lebih tau tentang himasi?</h2>
        <p className="text-gray-500 my-2">Ayo kunjungi sosial media himasi</p>
        <Button gradientDuoTone="tealToLime" className="rounded-tl-xl rounded-bl-none">
          <a href="https://www.instagram.com/himasi_utdi/" target="_blank" rel="noopener noreferrer">
            Social media himasi
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://himasi.utdi.ac.id/wp-content/uploads/2022/09/LOGO-BARU.png" className="object-scale-down h-50 w-50" alt="" />
      </div>
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl font-bold mb-2 text-gray-500">Ingin lebih tau tentang himaraksi?</h2>
        <p className="text-gray-500 my-2">Ayo kunjungi sosial media himaraksi</p>
        <Button gradientDuoTone="tealToLime" className="rounded-tl-xl rounded-bl-none">
          <a href="https://www.instagram.com/himaraksi_utdi/" target="_blank" rel="noopener noreferrer">
            Social media himaraksi
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://i.postimg.cc/FR2LG98X/himaraksi1.png" className="object-scale-down h-50 w-50" alt="" />
      </div>
    </div>
  );
};

export default CallToAction;
