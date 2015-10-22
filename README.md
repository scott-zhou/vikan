# vikan
Web application for virtual kanban (backlog &amp; task list)

based on angular,bootstrap,mongolab

http://code.tutsplus.com/tutorials/create-a-sticky-note-effect-in-5-easy-steps-with-css3-and-html5--net-13934


## Database information
Use Mongolab RESTful API for prototype.

Database: vikanban

Collection: task

task struct:

_id    -

title  - The title for task

type   - Could be study, coding, test and document for now. Which can mapping to different coller on frontend

status - ToDo, Doing, Done

owner  - The name for who is working on the task. Could be empty

description - Text description for any information
