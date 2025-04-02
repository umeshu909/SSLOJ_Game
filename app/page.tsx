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
                src="/images/actual/483866251_1568376057443274_1363687941621132760_n.jpg"
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
            <button onClick={() => setDbChoice("FR", 45202, "stats")}>
              <img
                src="/images/actual/GMC1wDZWUAAw1eJ.jpeg"
                alt="GL"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>13.03.2025</p>
          </div>
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-400">
              Japanese Version
            </h3>
            <button onClick={() => setDbChoice("JP", 34202, "stats")}>
              <img
                src="/images/actual/484951514_122228135144028168_4459275125812890120_n.jpg"
                alt="JP"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>20.03.2025</p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">Preview CN</h2>
          <div className="flex justify-center gap-6">
            <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center w-fit">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Young Athena
              </h3>
              <img
                src="/images/actual/K_yadianna_you.png"
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
    </div>
  );
}