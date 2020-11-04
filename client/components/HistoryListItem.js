import Link from 'next/link'

import EventNoteIcon from '@material-ui/icons/EventNote';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import { useState } from 'react';

import axios from 'axios';


const DeleteButton = ({ item, toggleDisplayNone }) => {


    const handleDelete = () => {

        // Delete the item - has to be params due to DELETE method (does not accept other ways)
        axios
            .delete(`${process.env.BASE_API_URL}/api/lists/delete`, { params: { ...item } })
            .then(res => {
                console.log(res.data.message);

                if (res.data._id) { toggleDisplayNone() };

            })
            .catch(err => {
                console.log('error in request -', err);
            });
    };

    return (
        <Button onClick={() => handleDelete()}>Delete</Button>
    )
}


const HistoryListItem = ({ item }) => {

    var timestamp = new Date(item.timestamp);

    var date = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(timestamp)
        + " " +
        (timestamp.getDay() + 1)
        + "." +
        (timestamp.getMonth() + 1)
        + "." +
        (timestamp.getFullYear() + 1);


    const [display, setDisplayNone] = useState({});

    return (

        <div className="card history-list__item" style={display}>
            <p className="name">{item.name}</p>

            <div className="info">
                <p className="timestamp">
                    <EventNoteIcon />
                    {date}
                </p>
                <p className={"status " + item.status}>
                    {item.status}
                </p>


            </div>

            <DeleteButton item={item} toggleDisplayNone={() => {
                setDisplayNone({
                    display: 'none'
                });

            }} />

            <IconButton color="primary">
                <Link href={`/history${item.slug}`}>
                    <ChevronRightIcon />
                </Link>
            </IconButton>

        </div>

    )
};



export default HistoryListItem;