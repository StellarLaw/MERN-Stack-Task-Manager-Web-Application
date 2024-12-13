import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box } from '@mui/material';

const TaskCalendar = ({ tasks }) => {
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    date: new Date(task.dueDate).toISOString().split('T')[0],
    backgroundColor: task.priority === 'high' ? '#ef5350' : 
                    task.priority === 'medium' ? '#fb8c00' : 
                    '#66bb6a',
    borderColor: task.priority === 'high' ? '#ef5350' : 
                task.priority === 'medium' ? '#fb8c00' : 
                '#66bb6a'
  }));

  return (
    <Box sx={{ mt: 2 }}>
    <FullCalendar
      key={tasks.length} // Ensure re-render when tasks array changes
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      height="auto"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      }}
    />
  </Box>
  );
};

export default TaskCalendar;