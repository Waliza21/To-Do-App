import React,{useState,useEffect} from 'react';
// import './App.css';
import {Box,Button,TextField,Typography,Paper,List,ListItem,ListItemText,IconButton, Checkbox} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


function App(){
  const [tasks,setTasks]=useState([]);
  const [input,setInput]=useState('');

  useEffect(()=> {
    fetch('http://localhost:5000/tasks')
    .then(res=>res.json())
    .then(data=>{
      console.log('Fetched tasks:',data);
      setTasks(data);
  })
    .catch(error=>console.error('Error fetching tasks:',error));
  },[]);

  const addTask=()=>{
    if(!input.trim()) return;
    fetch('http://localhost:5000/tasks',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({text:input})
    })
    .then(res=>res.json())
    .then(task=>setTasks(tasks=>[...tasks,task]));
    setInput('');
  };

const toggleTaskDone=(id,isDone)=>{
  fetch(`http://localhost:5000/tasks/${id}`,{
    method:'PUT',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({isDone:!isDone})
  })
    .then(res=>{
      if(!res.ok){
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(updatedTask=>{
      setTasks(tasks=>tasks.map(task=>task._id===id ? updatedTask:task));
    })
    .catch(error=>{
      console.error('Error toggling task:',error);
    });
};

  const deleteTask=(id)=>{
    fetch(`http://localhost:5000/tasks/${id}`,{method:'DELETE'})
    .then(()=>setTasks(tasks=>tasks.filter(t=>t._id!==id)));
  };

  return (
    // <div className='app-container' style={{maxWidth:400,margin:'auto',padding:20}}>
    //   <h1>To-Do-List</h1>
    //   <input value={input} onChange={e=>setInput(e.target.value)} placeholder='New Task...'/>
    //   <button onClick={addTask}>Add</button>
    //   <ul>
    //     {tasks.map(task=>(
    //       <li key={task.id}>
    //         {task.text}
    //         <button onClick={()=>deleteTask(task.id)} style={{marginLeft:10}}>Delete</button>
    //       </li>
    //     ))}
    //   </ul>
    //   </div>
    <Box sx={{bgcolor:'#e9ecef',minHeight:'100vh',py:5}}>
     <Paper elevation={6} sx={{maxWidth:420,mx:'auto',p:4,borderRadius:2}}>

      <Typography variant="h4" color='primary' fontWeight={600} gutterBottom>
        To-Do List
      </Typography>
      <Box sx={{display:'flex',mb:2}}>
        <TextField label='Add a new task'
        variant='outlined'
        fullWidth
        value={input}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{if (e.key==='Enter')addTask();}}/>
        <Button
        onClick={addTask}
        variant='contained'
        sx={{ml:2,py:1.3}}
        >Add</Button>
      </Box>
      <List>
        {tasks && tasks.length>0 && tasks.map(task=>(
          task?(
          <ListItem key={task._id} secondaryAction={
          <>
          <Checkbox
          edge="start"
          checked={task.isDone??false}
          onChange={()=>toggleTaskDone(task._id,task.isDone)}/>

          <IconButton edge='end' color='error' onClick={()=>deleteTask(task._id)}><DeleteIcon/></IconButton>
          </>
          }>
            <ListItemText primary={task.text|| ''}
             style={{textDecoration:task.isDone?'line-through':'none'}}
            />
          </ListItem>
        ): null
        )
      )}
      </List>
     </Paper>

    </Box>
  );
}

export default App;