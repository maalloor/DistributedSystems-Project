import React, { useState, useEffect } from 'react';

let initialPage = 0;
let endPage = 10;

export const Electronics= () => {
    const [activeButton, setActiveButton] = useState(true)
    const [reviewerID, setReviewerID] = useState("");
    const [asin, setAsin] = useState("");
    const [reviewerName, setReviewerName] = useState("");
    const helpful = [1, 50];
    const [reviewText, setReviewText] = useState("");
    const [overall, setOverall] = useState(0);
    const [summary, setSummary] = useState("");
    const [unixReviewTime, setUnixReviewTime] = useState(0);
    const [reviewTime, setReviewTime] = useState("");
    const [category, setCategory] = useState("Electronics");
    const [clase, setClase] = useState(0);
    const [taskName, setTaskName] = useState("");
    const [task, setTask] = useState([]);

    const [id, setId] = useState("")
    const [editing, setEditing] = useState(false)
    const [electronics, setElectronics] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(reviewerID, asin, helpful, reviewText,overall, summary, unixReviewTime, reviewTime);
        if (!editing)
        {
            fetch("http://localhost:5000/electronics", {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                {
                    reviewerID: reviewerID,
                    asin: asin,
                    reviewerName: reviewerName,
                    helpful: helpful,
                    reviewText: reviewText,
                    overall: overall,
                    summary: summary,
                    unixReviewTime: unixReviewTime,
                    reviewTime: reviewTime,
                    category: category,
                    class: clase
                })
            });
        }
        else
        {
            const result = await fetch(`http://localhost:5000/electronics/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                {
                    reviewerID: reviewerID,
                    asin: asin,
                    reviewerName: reviewerName,
                    helpful: helpful,
                    reviewText: reviewText,
                    overall: overall,
                    summary: summary,
                    unixReviewTime: unixReviewTime,
                    reviewTime: reviewTime,
                    category: category,
                    class: clase
                })
            });
            const response = await result.json();
            console.log(response);
            setEditing(false);
            setId('');
        }
        console.log(reviewerID, asin, helpful, reviewText,overall, summary, unixReviewTime, reviewTime);
        await getElectronics();
        setReviewerID("");
        setAsin("");
        setReviewerName("");
        setReviewText("");
        setOverall(0);
        setSummary("");
        setUnixReviewTime(0);
        setReviewTime("");
        setCategory("Electronics");
        setClase(0);
    }
    const handleSubmitTask = async (e) => {
        e.preventDefault();

        fetch("http://localhost:5000/electronics/result", {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
            {
                taskName: taskName
            })
        });
        console.log(taskName);
        await getResultTask();
        //setTaskName("");

    }

    const getElectronics = async () => {
        const result = await fetch(`http://localhost:5000/electronics/${initialPage}/${endPage}`)
        const response = await result.json();
        setElectronics(response)

        if (initialPage === 0) {
            setActiveButton(true)
        } else {
            setActiveButton(false)
        }
    }

    const getResultTask = async () => {
        const result = await fetch(`http://localhost:5000/electronics/result`)
        const response = await result.json();
        setTask(response)
    }

    function previousPage() {
        initialPage-= 10;
        endPage-= 10;
        getElectronics();
    }

    function nextPage() {
        initialPage+= 10;
        endPage+= 10;
        getElectronics();
    }

    useEffect(() => {
        getElectronics();
        getResultTask();
    }, [])

    const editElectronic = async (id) => {
        //console.log(id);
        const result = await fetch(`http://localhost:5000/electronic/${id}`)
        const response = await result.json();
        //console.log(response);
        setEditing(true);
        setId(id);
        setReviewerID(response.reviewerID);
        setAsin(response.asin);
        setReviewerName(response.reviewerName);
        setReviewText(response.reviewText);
        setOverall(response.overall);
        setSummary(response.summary);
        setUnixReviewTime(response.unixReviewTime);
        setReviewTime(response.reviewTime);
        setCategory(response.category);
        setClase(response.class);
    }

    const deleteElectronic = async (id) => {
        //console.log(id);
        const electronicResponse = window.confirm('Are you sure you want to delete it?')
        if (electronicResponse)
        {
            const result = await fetch(`http://localhost:5000/electronics/${id}`, {
                method: 'DELETE'
            });
            const response = await result.json();
            console.log(response);
            await getElectronics();
        }
    }
    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                        <label for="reviewerID">ReviewerID: </label>
                        <input
                            type="text"
                            name="reviewerID"
                            onChange={e => {setReviewerID(e.target.value); }}
                            value={reviewerID}
                            className="form-control"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="asin">Asin: </label>
                        <input
                            type="text"
                            name="asin"
                            onChange={e => {setAsin(e.target.value); }}
                            value={asin}
                            className="form-control"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="reviewerName">ReviewerName: </label>
                        <input
                            type="text"
                            onChange={e => {setReviewerName(e.target.value); }}
                            name="reviewerName"
                            value={reviewerName}
                            className="form-control"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="reviewerText">ReviewText: </label>
                        <input
                            type="text"
                            onChange={e => {setReviewText(e.target.value); }}
                            value={reviewText}
                            name="reviewerText"
                            className="form-control"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="overall">Overall: </label>
                        <input
                            type="number"
                            onChange={e => {setOverall(e.target.value); }}
                            value={overall}
                            name="overall"
                            className="form-control"
                            placeholder="Valor de 0 a 5"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="summary">Summary: </label>
                        <input
                            type="text"
                            onChange={e => {setSummary(e.target.value); }}
                            name="summary"
                            value={summary}
                            className="form-control"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                    <label for="unix">UnixReviewTime: </label>
                        <input
                            type="number"
                            onChange={e => {setUnixReviewTime(e.target.value); }}
                            name="unix"
                            value={unixReviewTime}
                            className="form-control"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="time">ReviewTime: </label>
                        <input
                            type="text"
                            onChange={e => {setReviewTime(e.target.value); }}
                            name="time"
                            value={reviewTime}
                            className="form-control"
                            placeholder="mm dd, yy"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="category">Category: </label>
                        <input
                            type="text"
                            onChange={e => {setCategory(e.target.value); }}
                            value={category}
                            name="category"
                            className="form-control"
                            disabled
                            autoFocus
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label for="class">Class: </label>
                        <input
                            type="number"
                            onChange={e => {setClase(e.target.value); }}
                            name="class"
                            value={clase}
                            className="form-control"
                            placeholder="0 ó 1"
                            autoFocus
                        />
                    </div>
                    <br/>
                    <button className="btn btn-primary btn-block">
                        {editing ? 'Edit' : 'Create'}
                    </button>
                </form>
            </div>
            <div className="col-md-8">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Reviewer ID</th>
                            <th>Reviewer Name</th>
                            <th>Overall</th>
                            <th>Category</th>
                            <th>Class</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {electronics.map(electronic => (
                            <tr key={electronic._id}>
                                <td>{electronic.reviewerID}</td>
                                <td>{electronic.reviewerName}</td>
                                <td>{electronic.overall}</td>
                                <td>{electronic.category}</td>
                                <td>{electronic.class}</td>
                                <td>
                                    <button className="btn btn-secondary btn-block" onClick={() => editElectronic(electronic._id)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-block" onClick={() => deleteElectronic(electronic._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button disabled={activeButton} className="btn btn-danger btn-block" onClick={() => previousPage()}>
                    Previous
                </button>
                <button className="btn btn-danger btn-block" onClick={() => nextPage()}>
                    Next
                </button>

                <div className="col-md-12">
                    <br/>
                    <hr/>
                    <br/>
                    <h3><strong>Tarea Map-Reduce</strong></h3>
                    <br/>
                    <strong>
                        Ingresar el nombre del crítico (reviewerName) para contabilizar los comentarios que realizó.
                    </strong>
                    <br/>
                    <br/>
                    <form onSubmit={handleSubmitTask} className="card card-body">
                        <div className="form-group">
                            <label for="taskName">ReviewerName: </label>
                            <input
                                type="text"
                                name="taskName"
                                onChange={e => {setTaskName(e.target.value); }}
                                value={taskName}
                                className="form-control"
                                autoFocus
                            />
                        </div>
                        <br/>
                        <button className="btn btn-primary btn-block">
                            Run
                        </button>
                    </form>
                    <br/>
                    <div className="col-md-12">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Reviewer ID</th>
                                    <th>Comments_count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {task.map(index => (
                                    <tr key={index._id}>
                                        <td>{index._id}</td>
                                        <td>{index.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}