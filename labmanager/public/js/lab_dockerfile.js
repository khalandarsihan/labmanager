frappe.ui.form.on('Lab Dockerfile', {
    refresh(frm) {
        console.log("Refreshing Lab Dockerfile form");
        
        // Clear any existing interval when form refreshes
        if (frm.session_timer) {
            clearInterval(frm.session_timer);
            frm.session_timer = null;
        }

        // Remove any existing session info
        if (frm.session_info_div) {
            frm.session_info_div.remove();
        }

        // Clear all custom buttons
        frm.clear_custom_buttons();

        // Check if there's an active session for this dockerfile
        frappe.call({
            method: 'labmanager.labmanager.lab_core.lab_controller.get_active_session',
            args: {
                'dockerfile_id': frm.doc.name
            },
            callback: function(response) {
                console.log("get_active_session response:", response);
                
                if (response.message && response.message.session) {
                    console.log("Active session found:", response.message.session);
                    show_active_session_info(frm, response.message.session);
                } else {
                    console.log("No active session, showing start button");
                    add_start_lab_button(frm);
                }
            }
        });
    },

    after_save: function(frm) {
        frm.reload_doc();
    }
});

// Function to add Start Lab button
function add_start_lab_button(frm) {
    console.log("Adding Start Lab button");
    
    frm.add_custom_button(__('Start Lab'), function() {
        console.log("Start Lab button clicked");
        frappe.call({
            method: 'labmanager.labmanager.lab_core.lab_controller.start_lab_session',
            args: {
                'dockerfile_id': frm.doc.name,
                'lab_course': frm.doc.lab_course,
                'lab_lesson': frm.doc.lab_lesson,
                'dockerfile_content': frm.doc.dockerfile_content
            },
            callback: function(response) {
                console.log("start_lab_session response:", response);
                if (response.message && response.message.success) {
                    show_session_created_message(response.message);
                    frm.reload_doc();
                } else {
                    handle_session_error(response.message);
                }
            }
        });
    }).addClass('btn-primary');
}

// Function to show active session information
function show_active_session_info(frm, session) {
    console.log("Showing active session info");
    
    // Add session control buttons
    frm.add_custom_button(__('End Session'), function() {
        end_lab_session(frm, session.name);
    }, __('Session Controls'));

    frm.add_custom_button(__('Extend Session'), function() {
        extend_lab_session(frm, session.name);
    }, __('Session Controls'));

    frm.add_custom_button(__('Reconnect'), function() {
        reconnect_to_session(session);
    }, __('Session Controls'));

    // Add session information section
    frm.session_info_div = $(`
        <div class="session-info" style="margin: 15px 0;">
            <div class="alert alert-info">
                <h5>${__('Active Lab Session')}</h5>
                <div class="session-details"></div>
            </div>
        </div>
    `).insertAfter(frm.layout.page.page);

    // Update session information and start timer
    update_session_info(frm, session);
    start_session_timer(frm, session);
}

// Function to update session information
function update_session_info(frm, session) {
    if (!frm.session_info_div) return;

    const end_time = moment(session.end_time);
    const now = moment();
    const duration = moment.duration(end_time.diff(now));
    
    const timeRemaining = duration.asSeconds() > 0 
        ? `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`
        : __('Session Expired');

    const sessionDetails = `
        <div>Status: <strong>${session.status}</strong></div>
        <div>Time Remaining: <strong>${timeRemaining}</strong></div>
        <div>Connection URL: <a href="${session.guacamole_url}" target="_blank">Open Lab Environment</a></div>
        <div>Username: <strong>${session.username}</strong></div>
        <div>Container Name: <strong>${session.container_name || 'N/A'}</strong></div>
        <div>Container Port: <strong>${session.container_port || 'N/A'}</strong></div>
    `;
    
    frm.session_info_div.find('.session-details').html(sessionDetails);

    if (duration.asSeconds() <= 0) {
        if (frm.session_timer) {
            clearInterval(frm.session_timer);
            frm.session_timer = null;
        }
        frm.reload_doc();
    }
}

// Function to start session timer
function start_session_timer(frm, session) {
    if (frm.session_timer) {
        clearInterval(frm.session_timer);
    }
    
    frm.session_timer = setInterval(() => {
        update_session_info(frm, session);
    }, 1000);
}

// Function to handle session end
function end_lab_session(frm, session_name) {
    frappe.confirm(
        __('Are you sure you want to end this lab session?'),
        function() {
            frappe.call({
                method: 'labmanager.labmanager.lab_core.lab_controller.end_lab_session',
                args: {
                    'session_name': session_name
                },
                callback: function(response) {
                    if (response.message && response.message.success) {
                        frappe.show_alert({
                            message: __('Lab session ended successfully'),
                            indicator: 'green'
                        });
                        frm.reload_doc();
                    } else {
                        frappe.msgprint(__('Failed to end session: ' + response.message.error));
                    }
                }
            });
        }
    );
}

// Function to handle session extension
function extend_lab_session(frm, session_name) {
    frappe.prompt([
        {
            fieldname: 'duration',
            label: __('Extension Duration (minutes)'),
            fieldtype: 'Int',
            reqd: 1,
            default: 30
        }
    ],
    function(values) {
        frappe.call({
            method: 'labmanager.labmanager.lab_core.lab_controller.extend_lab_session',
            args: {
                'session_name': session_name,
                'duration': values.duration * 60  // Convert to seconds
            },
            callback: function(response) {
                if (response.message && response.message.success) {
                    frappe.show_alert({
                        message: __('Session extended successfully'),
                        indicator: 'green'
                    });
                    frm.reload_doc();
                } else {
                    frappe.msgprint(__('Failed to extend session: ' + response.message.error));
                }
            }
        });
    },
    __('Extend Lab Session'),
    __('Extend')
    );
}

// Function to reconnect to session
function reconnect_to_session(session) {
    frappe.msgprint({
        title: __('Lab Session Connection Details'),
        indicator: 'green',
        message: __(
            `Username: ${session.username}<br>
            Password: ${session.password}<br>
            <a href="${session.guacamole_url}" target="_blank">Click here to connect to lab session</a>`
        )
    });
}

// Function to show session created message
function show_session_created_message(session_info) {
    frappe.msgprint({
        title: __('Lab Session Created'),
        indicator: 'green',
        message: __(
            `Lab session started successfully!<br>
            Username: ${session_info.username}<br>
            Password: ${session_info.password}<br>
            <a href="${session_info.guacamole_url}" target="_blank">Click here to open lab session</a>`
        )
    });
}

// Function to handle session errors
function handle_session_error(error_info) {
    frappe.msgprint({
        title: __('Session Creation Failed'),
        indicator: 'red',
        message: __('Failed to start lab: ' + error_info.error)
    });
}