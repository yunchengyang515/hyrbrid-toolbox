import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin, timeGridPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek',
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
