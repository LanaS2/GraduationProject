import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Calendar.css';
import Menu from '../components/Menu';

const Calendar = () => {
  const [state, setState] = useState({
    startDate: new Date(),
    selectedEvent: null,
    showEventSelector: false,
    toDoList: [],
    isSelectionMode: false,
    selectedItems: []
  });

  useEffect(() => {
    const savedToDoList = localStorage.getItem('toDoList');
    if (savedToDoList) {
      setState(prevState => ({
        ...prevState,
        toDoList: JSON.parse(savedToDoList)
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('toDoList', JSON.stringify(state.toDoList));
  }, [state.toDoList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prevState => {
        const newList = prevState.toDoList.map(task => {
          if (!task.done && new Date(task.date) < new Date()) {
            return { ...task, done: false }; 
          }
          return task;
        });
        return { ...prevState, toDoList: newList };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.toDoList]);

  const handleDateClick = date => {
    setState(prevState => ({
      ...prevState,
      startDate: date,
      showEventSelector: true
    }));
  };

  const handleEventSelect = event => {
    setState(prevState => ({
      ...prevState,
      selectedEvent: event,
      showEventSelector: false,
      toDoList: [...prevState.toDoList, { event, date: prevState.startDate.toLocaleDateString(), done: false }]
    }));
  };

  const toggleSelectionMode = () => {
    setState(prevState => ({
      ...prevState,
      isSelectionMode: !prevState.isSelectionMode,
      selectedItems: []
    }));
  };

  const handleDelete = () => {
    setState(prevState => {
      const newList = prevState.toDoList.filter((_, index) => !prevState.selectedItems.includes(index));
      return { ...prevState, toDoList: newList, selectedItems: [], isSelectionMode: false };
    });
  };

  const handleDone = index => {
    setState(prevState => {
      const newList = [...prevState.toDoList];
      newList[index].done = true;
      newList[index].doneAt = new Date();
      return { ...prevState, toDoList: newList };
    });
  };

  const handleItemCheckboxChange = (index, checked) => {
    setState(prevState => ({
      ...prevState,
      selectedItems: checked
        ? [...prevState.selectedItems, index]
        : prevState.selectedItems.filter(itemIndex => itemIndex !== index)
    }));
  };

  const getEventColor = event => {
    switch (event) {
      case 'Irrigation':
        return '#007bff';
      case 'Fertilization':
        return '#28a745';
      case 'Pruning':
        return '#fd7e14';
      case 'Pest Control':
        return '#dc3545';
      case 'Harvesting':
        return '#6f42c1';
      case 'Seasonal Tasks':
        return '#ffc107';
      default:
        return '#000';
    }
  };

  const categorizeItems = (toDoList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() + 7);
    thisWeek.setHours(0, 0, 0, 0);
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() + 1);
    thisMonth.setHours(0, 0, 0, 0);
    const thisYear = new Date();
    thisYear.setFullYear(thisYear.getFullYear() + 1);
    thisYear.setHours(0, 0, 0, 0);
  
    const todayItems = [];
    const thisWeekItems = [];
    const thisMonthItems = [];
    const thisYearItems = [];
    const unfinishedTasks = [];
  
    toDoList.forEach((item, index) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      if (itemDate <= today) {
        todayItems.push({ ...item, index });
      } else if (itemDate <= thisWeek) {
        thisWeekItems.push({ ...item, index });
      } else if (itemDate <= thisMonth) {
        thisMonthItems.push({ ...item, index });
      } else if (itemDate <= thisYear) {
        thisYearItems.push({ ...item, index });
      } else if (!item.done && itemDate < today) {
        unfinishedTasks.push({ ...item, index });
      }
    });
  
    return {
      'Today': todayItems,
      'This Week': thisWeekItems,
      'This Month': thisMonthItems,
      'This Year': thisYearItems,
      'Unfinished Tasks': unfinishedTasks
    };
  };
  
  const categorizedItems = categorizeItems(state.toDoList);

  return (
    <div className="calendar-container">
      <header>
        <Menu />
      </header>
      <DatePicker
        selected={state.startDate}
        onChange={date => handleDateClick(date)}
        inline
      />
      {state.showEventSelector && (
        <div className="event-selector">
          <div className="event-selector-inner">
            <label htmlFor="events" className="event-label">Select Task:</label>
            <select id="events" value={state.selectedEvent} onChange={e => handleEventSelect(e.target.value)} className="event-select">
              <option value="">Select Task</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Fertilization">Fertilization</option>
              <option value="Pruning">Pruning</option>
              <option value="Pest Control">Pest Control</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Seasonal Tasks">Seasonal Tasks</option>
            </select>
          </div>
        </div>
      )}
      <div className="to-do-list">
        <div className="list-header">
          {!state.isSelectionMode && (
            <button onClick={toggleSelectionMode}>Select Items</button>
          )}
          {state.isSelectionMode && (
            <>
              <button onClick={toggleSelectionMode}>Cancel Selection</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
        <h2 className="to-do-header" id="tasks-list">Tasks-List</h2>
        {Object.keys(categorizedItems).map(category => (
          <div key={category}>
            <h3 id={category}>{category}</h3>
            <ul className="to-do-ul">
              {categorizedItems[category].map(({ event, date, index, done }) => (
                <li key={index} className={`to-do-li ${state.selectedItems.includes(index) ? 'selected' : ''} ${done ? 'done' : ''}`}>
                  {state.isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={state.selectedItems.includes(index)}
                      onChange={e => handleItemCheckboxChange(index, e.target.checked)}
                    />
                  )}
                  <span className="event-color" style={{ backgroundColor: getEventColor(event) }}></span>
                  <span>{date}: {event}</span>
                  {!done && !state.isSelectionMode && <button onClick={() => handleDone(index)}>Done</button>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
