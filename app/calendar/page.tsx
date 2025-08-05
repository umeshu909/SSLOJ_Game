'use client'

import FullCalendar from '@fullcalendar/react'
import frLocale from "@fullcalendar/core/locales/fr";
import enLocale from "@fullcalendar/core/locales/en-gb";

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import '@/styles/global.css'
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from "react-i18next";

import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { fr, enUS } from "date-fns/locale";



const typeColors: Record<string, string> = {
  duel: "#3b82f6",
  competition: "#10b981",
  dreamland: "#eab308",
  glory: "#f43f5e",
  gods: "#8b5cf6",
  relics: "#ea580c",
  arena: "#0ea5e9",
  tournois: "#9ea5e9",
};


export default function TimelineCalendar() {
  const [events, setEvents] = useState([])
  const [lang, setLang] = useState("FR")
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [enabledCategories, setEnabledCategories] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [relicBosses, setRelicBosses] = useState([]);

  const { t, i18n } = useTranslation("common");

  const fullCalendarLocales = {
    fr: frLocale,
    en: enLocale,
  };

  const calendarLocale = useMemo(() => fullCalendarLocales[t.language] || enLocale, [t.language]);

  const handleViewChange = (view: any) => {
    setCurrentView(view.view.type);
  };

  const categories = [
    { id: 'duel', label: t("calendar.combatDuel") },
    { id: 'competition', label: t("calendar.competition")  },
    { id: 'dreamland', label: t("calendar.dreamland")  },
    { id: 'glory', label: t("calendar.glory")  },
    { id: 'gods', label: t("calendar.gods")  },
    { id: 'relics', label: t("calendar.relics")  },
    { id: 'arena', label: t("calendar.arena")  },
    { id: 'tournois', label: t("calendar.tournois")  }
  ]

  const localeMap: Record<string, Locale> = {
    fr,
    en: enUS,
    // ajoute d'autres si besoin
  };

  const currentLocale = localeMap[t.language] || fr;

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "FR"
    setLang(storedLang)
  }, [])


  useEffect(() => {
    if (!lang) return

    fetch('/api/calendar', {
      headers: { 'x-db-choice': lang }
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((event: any) => {
          let start = event.start?.replace(' ', 'T');
          let end = event.end?.replace(' ', 'T');
          let end2 = event.end2?.replace(' ', 'T');

          // Si l'événement est de type relics, on enlève 2 heures
          if (event.category === "relics") {
            const adjust = (dateStr: string) => {
              const d = new Date(dateStr);
              d.setHours(d.getHours() - 2);
              return d.toISOString();
            };

            if (start) start = adjust(start);
            if (end) end = adjust(end);
            if (end2) end2 = adjust(end2);
          }

          // Formattage du titre de l'event
          //event.title = t(`calendar.${event.category}`);

          return {
            ...event,
            start,
            end,
            end2,
            allDay: false
          };
        });

        setEvents(formatted);
      })

      .catch((err) => console.error("Erreur fetch calendar :", err))
    }, [lang])

    useEffect(() => {
      const loadBosses = async () => {
        if (selectedEvent?.extendedProps?.phase === "stamina") {
          const res = await fetch("/api/relics/bosses", {
            headers: { 'x-db-choice': lang }
          });
          const data = await res.json();
          const parsed = data.map((b: any) => ({
            ...b,
            unlocktime: Number(b.unlocktime),
            rebirthtime: Number(b.rebirthtime || 0), // ← si vide, on met 0
          }));

          setRelicBosses(parsed);
        }
      };

      // Attendre que selectedEvent soit prêt
      if (selectedEvent) {
        loadBosses();
      }
    }, [selectedEvent, lang]);


  const bossRows = useMemo(() => {
    if (
      selectedEvent?.extendedProps?.phase === 'stamina' &&
      relicBosses.length >= 4 &&
      relicBosses.every(b => typeof b.unlocktime === 'number' && typeof b.rebirthtime === 'number')
    ) {
      const rows: { label: string; time: Date }[] = [];
      const startDate = new Date(selectedEvent.start);
      const [b1, b2, b3, b4] = relicBosses;

      const t1 = new Date(startDate.getTime() + (b1.unlocktime) * 1000);
      rows.push({ label: 'Boss 1', time: t1 });

      const t2 = new Date(startDate.getTime() + (b2.unlocktime) * 1000);
      rows.push({ label: 'Boss 2', time: t2 });

      const t3 = new Date(startDate.getTime() + (b3.unlocktime) * 1000);
      rows.push({ label: 'Boss 3', time: t3 });

      const t4 = new Date(startDate.getTime() + (b4.unlocktime) * 1000);
      rows.push({ label: 'Boss 4', time: t4 });

      let last = new Date(t4);
      for (let i = 1; i <= 3; i++) {
        last = new Date(last.getTime() + (b4.rebirthtime) * 1000);
        rows.push({ label: `Rerun ${i}`, time: last });
      } 
      return rows;
    }
    return [];
  }, [selectedEvent, relicBosses]);



  const filteredEvents = useMemo(() => {
    return events
      .filter((e: any) => enabledCategories.includes(e.category))
      .map((e: any) => {
        if (currentView === "dayGridMonth" && e.category === "relics") {
          const start = new Date(e.start);
          const end = new Date(e.end);

          const duration = end.getTime() - start.getTime();
          const durationDays = duration / (1000 * 60 * 60 * 24);

          if (durationDays >= 1) {
            const adjustedEnd  = new Date(end);
            const adjustedEnd2 = new Date(end);
            adjustedEnd.setDate(adjustedEnd.getDate() - 1);
            adjustedEnd2.setDate(adjustedEnd2.getDate()); 
            return {
              ...e,
              end: adjustedEnd.toISOString(),
              end2: adjustedEnd2.toISOString()
            };
          }
        }

        return e;
      });
  }, [events, enabledCategories, currentView]);


  const toggleCategory = (categoryId: string) => {
    setEnabledCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const renderEventContent = (eventInfo: any) => {
    const viewType = eventInfo.view.type;
    const startTime = eventInfo.timeText;

    // Vue mensuelle : pas d'heure
    if (currentView === "dayGridMonth") {
      return <div style={{ paddingLeft: "4px" }}>{eventInfo.event.title}</div>;
    }

    // Vues avec heure : on affiche l'heure + titre
    return (
      <div>
        <b>{startTime}</b> <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">

      {/* Filtres - desktop */}
      <div className="hidden lg:flex flex-col w-[240px] bg-[#1a1a2b] p-4 rounded-xl shadow-md text-white">
        <h2 className="text-lg font-semibold mb-4">{t("interface.filters")}</h2>
        <div className="flex flex-col gap-2">
          {categories.map(cat => {
            const isActive = enabledCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition
                  ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  style={{
                    backgroundColor: enabledCategories.includes(cat.id)
                      ? typeColors[cat.id]
                      : "#374151" // gris par défaut
                  }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>



      {/* CALENDRIER */}
      <div className="flex-1 pt-[58px]">
        <FullCalendar
          key={t.language}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          firstDay={1}
          locale={calendarLocale}
          showNonCurrentDates={true}
          initialView="dayGridMonth"
          fixedWeekCount={true}
          eventContent={renderEventContent}
          events={filteredEvents}
          datesSet={handleViewChange}
          timeZone="local"
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // pour format 24h
          }}

          allDaySlot={true}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          eventClick={(info) => {
            setSelectedEvent(info.event);
          }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth, timeGridWeek'
          }}
        />
      </div>

      {/* MODAL (inchangé) */}
      {selectedEvent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#1f1f2e] text-white p-6 rounded-xl shadow-xl max-w-lg w-full relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-3 text-gray-300 hover:text-white text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>

            {selectedEvent.extendedProps?.phase === "enrollday" && (
              <>
                <div className="text-sm text-gray-400 mb-4">
                  <span className="text-white font-medium">{t("calendar.from")}</span>{" "}
                  {format(new Date(selectedEvent.start), "dd/MM/yyyy HH:mm", { locale: currentLocale })}{" "}
                  <span className="text-white font-medium">{t("calendar.to")}</span>{" "}
                  {selectedEvent.extendedProps?.end2
                  ? format(new Date(selectedEvent.extendedProps.end2), "dd/MM/yyyy HH:mm", { locale: currentLocale })
                  : format(selectedEvent.end, "dd/MM/yyyy HH:mm", { locale: currentLocale })}

                </div>
                <div className="text-sm text-gray-400 mb-2">
                  <span className="text-white font-medium">{t("calendar.nbPlayers")} :</span> {selectedEvent.extendedProps?.players} {t("calendar.players")} 
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  <span className="text-white font-medium">{t("calendar.duration")} :</span> 2 {t("calendar.days")}
                </div>


              </>
            )}


            {selectedEvent.extendedProps?.phase === "stamina" && (
              <>
                  <div className="text-sm text-gray-400 mb-4">
                    <span className="text-white font-medium">{t("calendar.from")}</span>{" "}
                    {format(new Date(selectedEvent.start), "dd/MM/yyyy HH:mm", { locale: currentLocale })}{" "}
                    <span className="text-white font-medium">{t("calendar.to")}</span>{" "}
                    {selectedEvent.extendedProps?.end2
                    ? format(new Date(selectedEvent.extendedProps.end2), "dd/MM/yyyy HH:mm", { locale: currentLocale })
                    : format(selectedEvent.end, "dd/MM/yyyy HH:mm", { locale: currentLocale })}

                  </div>

                  {bossRows.length === 0 ? (
                    <p className="text-sm text-red-400 mb-2">{t("calendar.loadTimes")}</p>
                  ) : (
                    <table className="w-full text-sm text-gray-300 mb-4 border-collapse">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-1 px-2 w-28">{t("calendar.Phase")}</th>
                          <th className="text-left py-1 px-2">{t("calendar.dateAndHour")}</th>
                          <th className="text-left py-1 px-2">Boss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bossRows.map((row, i) => (
                          <tr key={i}>
                            <td className="py-1 px-2">{row.label}</td>
                            <td className="py-1 px-2">
                              {format(row.time, "dd/MM/yyyy à HH'h'mm", { locale: currentLocale })}
                              {row.label === "Boss 4" && (
                                <div className="flex gap-2 items-center">
                                  {t("calendar.afterPandore")}
                                </div>
                              )}
                              {(row.label === "Rerun 1" || row.label === "Rerun 2" || row.label === "Rerun 3" || row.label === "Rerun 4") && (
                                <div className="flex gap-2 items-center">
                                  {t("calendar.fromHour")}
                                </div>
                              )}
                            </td>
                            <td className="py-1 px-2">
                              {row.label === "Boss 1" && (
                                <img src="/images/avatar_rounded/15301.png" width="50px"/>
                              )}
                              {row.label === "Boss 2" && (
                                <img src="/images/avatar_rounded/65202.png" width="50px"/>
                              )}
                              {row.label === "Boss 3" && (
                                <img src="/images/avatar_rounded/65302.png" width="50px"/>
                              )}
                              {row.label === "Boss 4" && (
                                <div className="flex gap-2 items-center">
                                  <img src="/images/avatar_rounded/65304.png" width="50px"/>
                                  <img src="/images/avatar_rounded/65303.png" width="50px"/>
                                </div>
                              )}
                              {row.label.startsWith("Rerun") && (
                                <div className="flex gap-2 items-center">
                                  <img src="/images/avatar_rounded/65304.png" width="50px"/>
                                  <img src="/images/avatar_rounded/65303.png" width="50px"/>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedEvent.extendedProps?.buffs?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Boss :</h3>
                      <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                        {selectedEvent.extendedProps.buffs.map((b: string, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                        ))}
                      </ul>
                    </div>
                  )}
                </>
            )}





            {selectedEvent.extendedProps?.phase === "silence" && (
              <>
                <div className="text-sm text-gray-400 mb-4">
                  <span className="text-white font-medium">{t("calendar.from")}</span>{" "}
                  {format(new Date(selectedEvent.start), "dd/MM/yyyy HH:mm", { locale: currentLocale })}{" "}
                  <span className="text-white font-medium">{t("calendar.to")}</span>{" "}
                  {format(new Date(selectedEvent.end), "dd/MM/yyyy HH:mm", { locale: currentLocale })}
                </div>
                <div className="text-sm text-red-400 font-semibold mb-2">
                  {t("calendar.noStamina")}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  <span className="text-white font-medium">{t("calendar.duration")} :</span> 1 {t("calendar.days")}
                </div>
              </>
            )}

            {!selectedEvent.extendedProps?.phase && (
              <>
                <div className="text-sm text-gray-400 mb-4">
                  {t("calendar.from")}{" "}
                  <span className="text-white">
                    {format(new Date(selectedEvent.start), "dd MMMM yyyy", { locale: currentLocale })}
                  </span>{" "}
                  {t("calendar.to")}{" "}
                  <span className="text-white">
                    {format(new Date(selectedEvent.end), "dd MMMM yyyy", { locale: currentLocale })}
                  </span>
                </div>
                {selectedEvent.extendedProps?.buffs?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Buffs :</h3>
                    <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                      {selectedEvent.extendedProps.buffs.map((b: string, i: number) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}



      {/* Bouton mobile "Filtrer" */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center z-40">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg"
        >
          {t("interface.filter")}
        </button>
      </div>

      {/* Panneau mobile des filtres */}
      <div className={`lg:hidden fixed inset-0 bg-[#1a1a2b] z-50 overflow-y-auto p-6 transition-transform duration-300 ease-in-out
        ${showMobileFilters ? "translate-y-0" : "translate-y-full pointer-events-none"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{t("interface.filters")}</h2>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="text-white text-sm border border-white/30 px-3 py-1 rounded"
          >
            {t("interface.close")}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {categories.map(cat => {
            const isActive = enabledCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition
                  ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                style={{
                  backgroundColor: enabledCategories.includes(cat.id)
                    ? typeColors[cat.id]
                    : "#374151" // gris par défaut
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>



    </div>


  )
}
