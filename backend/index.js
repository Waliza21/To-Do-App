const express=require('express');
const cors=require('cors');
const app=express();
const PORT=5000;

app.use(cors());
app.use(express.json());

let tasks=[];

app.get('/tasks',(req,res)=>res.json(tasks));
app.post('/tasks',(req,res)=>{
    const task={id:Date.now(),...req.body};
    tasks.push(task);
    res.status(201).json(task);
});
app.delete('/tasks/:id',(req,res)=>{
    tasks=tasks.filter(t=>t.id!=req.params.id);
    res.sendStatus(204);
});

app.listen(PORT,()=> console.log( `Backend running on port ${PORT}`));

