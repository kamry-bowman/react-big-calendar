import React from 'react'
import events from '../events'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import Layout from 'react-tackle-box/Layout'
import Card from '../Card'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const formatName = (name, count) => `${name} ID ${count}`

class Dnd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: events,
      draggedEvent: null,
      counters: {
        item1: 0,
        item2: 0,
      },
    }
  }

  handleDragStart = name => {
    this.setState({ draggedEvent: name })
  }

  onDropFromOutside = ({ event: { start, end }, isAllDay }) => {
    console.log(`Event: ${isAllDay}`)
    console.log(`Event: ${event}`)
    const { draggedEvent, counters } = this.state
    const event = {
      title: formatName(draggedEvent, counters[draggedEvent]),
      start,
      end,
      isAllDay,
    }
    const updatedCounters = {
      ...counters,
      [draggedEvent]: counters[draggedEvent] + 1,
    }
    this.setState({ draggedEvent: null, counters: updatedCounters })
    this.newEvent(event)
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

    //alert(`${event.title} was resized to ${start}-${end}`)
  }

  newEvent(event) {
    let idList = this.state.events.map(a => a.id)
    let newId = Math.max(...idList) + 1
    let hour = {
      id: newId,
      title: event.title,
      allDay: event.isAllDay,
      start: event.start,
      end: event.end,
    }
    this.setState({
      events: this.state.events.concat([hour]),
    })
  }

  render() {
    return (
      <div>
        <Card
          className="examples--header"
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          {Object.entries(this.state.counters).map(([name, count]) => (
            <div
              style={{
                border: '2px solid gray',
                borderRadius: '4px',
                width: '100px',
              }}
              draggable="true"
              key={name}
              onDragStart={() => this.handleDragStart(name)}
              onDragEnd={this.handleDragEnd}
            >
              {formatName(name, count)}
            </div>
          ))}
        </Card>
        <DragAndDropCalendar
          selectable
          localizer={this.props.localizer}
          events={this.state.events}
          onEventDrop={this.moveEvent}
          onDropFromOutside={this.onDropFromOutside}
          resizable
          onEventResize={this.resizeEvent}
          onSelectSlot={this.newEvent}
          onD
          defaultView={BigCalendar.Views.MONTH}
          defaultDate={new Date(2015, 3, 12)}
        />
      </div>
    )
  }
}

export default Dnd
