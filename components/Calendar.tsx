import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,listWeek',
      }}
      initialView='dayGridMonth'
      nowIndicator
      editable
      selectable
      selectMirror
      initialEvents={[{ title: 'nice event', start: new Date(), resourceId: 'a' }]}
      height='auto'
    />
  )
}
