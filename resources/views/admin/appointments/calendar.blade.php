@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-12">
            <h1>Appointment Calendar</h1>
        </div>
    </div>

    <!-- Legend -->
    <div class="row mb-3">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h6 class="mb-3">Legend:</h6>
                    <div class="row">
                        <div class="col-md-3">
                            <span class="badge" style="background-color: #0d6efd; padding: 8px 12px; display: inline-block;"><i class="fa fa-circle"></i> Scheduled</span>
                        </div>
                        <div class="col-md-3">
                            <span class="badge" style="background-color: #198754; padding: 8px 12px; display: inline-block;"><i class="fa fa-circle"></i> Completed</span>
                        </div>
                        <div class="col-md-3">
                            <span class="badge" style="background-color: #ffc107; padding: 8px 12px; display: inline-block;"><i class="fa fa-circle"></i> In Progress</span>
                        </div>
                        <div class="col-md-3">
                            <span class="badge" style="background-color: #dc3545; padding: 8px 12px; display: inline-block;"><i class="fa fa-circle"></i> Cancelled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <div id="calendar"></div>
        </div>
    </div>

    <!-- Appointment Details Modal -->
    <div class="modal fade" id="appointmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Appointment Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="appointmentDetails">
                    <!-- Appointment details will be loaded here -->
                </div>
                <div class="modal-footer">
                    <a href="#" id="viewAppointmentBtn" class="btn btn-primary">View Full Details</a>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>

@push('styles')
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css" rel="stylesheet">
<style>
    .fc .fc-button-primary {
        background-color: #2E7D32;
        border-color: #2E7D32;
    }
    .fc .fc-button-primary:hover {
        background-color: #1B5E20;
        border-color: #1B5E20;
    }
    .fc .fc-button-primary.fc-button-active {
        background-color: #1B5E20;
        border-color: #1B5E20;
    }
    .fc-daygrid-day.fc-day-today {
        background-color: #e8f5e9 !important;
    }
    .fc-event {
        cursor: pointer;
    }
    #calendar {
        font-family: 'Poppins', sans-serif;
    }
</style>
@endpush

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
<script>
$(document).ready(function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        height: 'auto',
        events: {
            url: '{{ route("admin.appointments.calendar-events") }}',
            format: 'json'
        },
        eventClick: function(info) {
            var event = info.event;
            
            var detailsHtml = `
                <div class="appointment-details">
                    <p><strong>Pet:</strong> ${event.extendedProps.pet?.name || 'N/A'}</p>
                    <p><strong>Service:</strong> ${event.extendedProps.service?.name || 'N/A'}</p>
                    <p><strong>Owner:</strong> ${event.extendedProps.user?.name || 'N/A'}</p>
                    <p><strong>Veterinarian:</strong> ${event.extendedProps.veterinarian?.name || 'Not assigned'}</p>
                    <p><strong>Status:</strong> <span class="badge" style="background-color: ${getStatusColor(event.extendedProps.status)}">${getStatusLabel(event.extendedProps.status)}</span></p>
                    <p><strong>Date & Time:</strong> ${event.start ? event.start.toLocaleString() : 'N/A'}</p>
                    <p><strong>Notes:</strong> ${event.extendedProps.notes || 'None'}</p>
                </div>
            `;
            
            $('#appointmentDetails').html(detailsHtml);
            $('#viewAppointmentBtn').attr('href', '/admin/appointments/' + event.id);
            
            var modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
            modal.show();
        },
        datesSet: function(info) {
            // Refresh events when dates change
            calendar.refetchEvents();
        }
    });
    
    calendar.render();
});

function getStatusColor(status) {
    switch(status) {
        case 'scheduled':
            return '#0d6efd';
        case 'completed':
            return '#198754';
        case 'in_progress':
            return '#ffc107';
        case 'cancelled':
            return '#dc3545';
        default:
            return '#6c757d';
    }
}

function getStatusLabel(status) {
    switch(status) {
        case 'scheduled':
            return 'Scheduled';
        case 'completed':
            return 'Completed';
        case 'in_progress':
            return 'In Progress';
        case 'cancelled':
            return 'Cancelled';
        default:
            return 'Unknown';
    }
}
</script>
@endpush
@endsection
