"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const setDbChoice = (dbChoice: string, id: number, categId: string) => {
    fetch("/api/set-db-choice", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `dbChoice=${dbChoice}`,
    })
      .then(() => {
        router.push(`/characters/${id}?dbChoice=${dbChoice}&categId=${categId}`);
      })
      .catch((error) =>
        console.error("Erreur lors de la mise à jour de la session :", error)
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white py-12 px-4 sm:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Last Releases</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-400">
              Chinese Version
            </h3>
            <button onClick={() => setDbChoice("CN", 55311, "stats")}>
              <img
                src="/images/actual/CN.jpg"
                alt="CN"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>12.03.2025</p>
          </div>
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-400">
              Global Version
            </h3>
            <button onClick={() => setDbChoice("FR", 15202, "stats")}>
              <img
                src="/images/actual/GLO.jpg"
                alt="GL"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>17.04.2025</p>
          </div>
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-400">
              Japanese Version
            </h3>
            <button onClick={() => setDbChoice("JP", 55305, "stats")}>
              <img
                src="/images/actual/JP.jpg"
                alt="JP"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>09.04.2025</p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">Preview CN</h2>
          <div className="flex justify-center gap-6">
            <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center w-fit">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Pandore ND
              </h3>
              <img
                src="/images/actual/K_panduola_nd.png"
                alt="Preview"
                className="rounded-lg"
              />
            </div>
            <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center w-fit">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Shiryu semi-naked
              </h3>
              <img
                src="/images/actual/K_zilong_chuancheng.png"
                alt="Preview"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center rounded-lg shadow-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Join us on Discord</h3>
        <a
          href="https://discord.gg/enGQVj9WvJ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 245 240"
            className="w-6 h-6 fill-current"
          >
            <path d="M104.4 104.2c-5.7 0-10.2 5-10.2 11.1 0 6.1 4.6 11.1 10.2 11.1 5.7 0 10.3-5 10.2-11.1.1-6.2-4.5-11.1-10.2-11.1zm36.2 0c-5.7 0-10.2 5-10.2 11.1 0 6.1 4.6 11.1 10.2 11.1s10.3-5 10.2-11.1c.1-6.2-4.5-11.1-10.2-11.1z" />
            <path d="M189.5 20h-134C42.7 20 30 32.7 30 48.5v143c0 15.8 12.7 28.5 28.5 28.5h113.2l-5.3-18.5 12.9 12 12.1 11.2L215 215V48.5C215 32.7 202.3 20 189.5 20zm-41.5 135s-3.9-4.6-7.1-8.6c14.1-4 19.4-12.9 19.4-12.9-4.4 2.9-8.6 5-12.3 6.4-5.3 2.2-10.4 3.7-15.4 4.6-10.2 1.9-19.5 1.4-27.6-.1-6.1-1.2-11.4-2.9-15.8-4.6-2.5-1-5.2-2.2-7.9-3.8-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s5.1 8.5 18.6 12.8c-3.2 4-7.1 8.7-7.1 8.7-23.4-.7-32.3-16.1-32.3-16.1 0-34.1 15.3-61.8 15.3-61.8 15.3-11.5 29.8-11.2 29.8-11.2l1 1.2c-19.1 5.5-27.9 13.9-27.9 13.9s2.3-1.2 6.2-2.9c11.3-5 20.3-6.4 24-6.7.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-8.4-8-26.4-13.4l1.4-1.6s14.5-.3 29.8 11.2c0 0 15.3 27.7 15.3 61.8 0-.1-8.9 15.3-32.4 16z" />
          </svg>
          Rejoindre
        </a>
      </div>



    </div>
  );
}