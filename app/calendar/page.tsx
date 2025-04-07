'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import '@/styles/global.css'

import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const categories = [
  { id: 'duel', label: 'Combat Duel' },
  { id: 'competition', label: 'Compétition Compétence' },
  { id: 'dreamland', label: 'Illusion du vide' },
  { id: 'glory', label: 'Tournoi des points de Gloire' },
  { id: 'gods', label: 'Champ de bataille des Dieux' },
  { id: 'relics', label: 'Reliques des Dieux' },
  { id: 'arena', label: 'Arène Mondiale' }
]

const typeColors: Record<string, string> = {
  duel: "#3b82f6",
  competition: "#10b981",
  dreamland: "#eab308",
  glory: "#f43f5e",
  gods: "#8b5cf6",
  relics: "#ea580c",
  arena: "#0ea5e9",
};


export default function TimelineCalendar() {
  const [events, setEvents] = useState([])
  const [lang, setLang] = useState("FR")
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [enabledCategories, setEnabledCategories] = useState<string[]>(categories.map(c => c.id));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      .then(data => setEvents(data))
      .catch((err) => console.error("Erreur fetch calendar :", err))
  }, [lang])

  const filteredEvents = useMemo(() => {
    return events.filter((e: any) => enabledCategories.includes(e.category))
  }, [events, enabledCategories])

  const toggleCategory = (categoryId: string) => {
    setEnabledCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">

      {/* Filtres - desktop */}
      <div className="hidden lg:flex flex-col w-[240px] bg-[#1a1a2b] p-4 rounded-xl shadow-md text-white">
        <h2 className="text-lg font-semibold mb-4">Filtres</h2>
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
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          firstDay={1}
          showNonCurrentDates={true}
          initialView="dayGridMonth"
          fixedWeekCount={true}
          events={filteredEvents}
          timeZone="local"
          height="auto"
          eventTimeFormat={false}
          allDaySlot={true}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          eventClick={(info) => {
            setSelectedEvent({
              title: info.event.title,
              start: info.event.startStr,
              end: info.event.endStr,
              extendedProps: info.event.extendedProps
            });
          }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
        />
      </div>

      {/* MODAL (inchangé) */}
      {selectedEvent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#1f1f2e] text-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-3 text-gray-300 hover:text-white text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
            <div className="text-sm text-gray-400 mb-4">
              Du{" "}
              <span className="text-white">
                {format(new Date(selectedEvent.start), "dd MMMM yyyy", { locale: fr })}
              </span>{" "}
              au{" "}
              <span className="text-white">
                {format(new Date(selectedEvent.end), "dd MMMM yyyy", { locale: fr })}
              </span>
            </div>
            {selectedEvent.extendedProps?.buffs?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Buffs :</h3>
                <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                  {selectedEvent.extendedProps.buffs.map((buff: string, i: number) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: buff }} />
                  ))}
                </ul>
              </div>
            )}
            {(selectedEvent.extendedProps.enrollday ||
              selectedEvent.extendedProps.stamina ||
              selectedEvent.extendedProps.silence ||
              selectedEvent.extendedProps.total ||
              selectedEvent.extendedProps.players) && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Infos Relique :</h3>
                <ul className="text-sm space-y-1">
                  {selectedEvent.extendedProps.players && <li>Joueurs : {selectedEvent.extendedProps.players}</li>}
                  {selectedEvent.extendedProps.enrollday && <li>Pré-inscription : {selectedEvent.extendedProps.enrollday}</li>}
                  {selectedEvent.extendedProps.stamina && <li>Stamina : {selectedEvent.extendedProps.stamina}</li>}
                  {selectedEvent.extendedProps.silence && <li>Silence : {selectedEvent.extendedProps.silence}</li>}
                  {selectedEvent.extendedProps.total && <li>Durée totale : {selectedEvent.extendedProps.total}</li>}
                </ul>
              </div>
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
          Filtrer
        </button>
      </div>

      {/* Panneau mobile des filtres */}
      <div className={`lg:hidden fixed inset-0 bg-[#1a1a2b] z-50 overflow-y-auto p-6 transition-transform duration-300 ease-in-out
        ${showMobileFilters ? "translate-y-0" : "translate-y-full pointer-events-none"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Filtres</h2>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="text-white text-sm border border-white/30 px-3 py-1 rounded"
          >
            Fermer
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
