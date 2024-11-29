import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

interface CalendarProps {
  events: { title: string; start: string; resourceId?: string }[]
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
      headerToolbar={{
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,listWeek',
      }}
      initialView='dayGridMonth'
      nowIndicator
      editable
      selectable
      selectMirror
      events={events} // Dynamically pass events from props
      height='auto'
    />
  )
}
