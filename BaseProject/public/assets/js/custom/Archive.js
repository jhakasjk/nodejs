var daysname = '';
var daysnumber = '';
function process(date) {
    var parts = date.split("-");
    return new Date(parts[2], parts[0] - 1, parts[1] );
}
jQuery(function ($) {
    $('ul.nav-list li').removeClass('active');
    $('ul.nav-list li.archivesetup').addClass('active');

    $.validator.addMethod("greaterStart", function (value, element, params) { 
        return this.optional(element) || new Date(process(value)) >= new Date(process($(params).val()));
    }, 'Must be greater than start date.');   
      
    $('form.form-horizontal').validate({
        
        onfocusout: false, // disable blur on fields so animate doesn't replay
        onclick: false,
        ignore: ":hidden,#CorporateID",
        rules: {
            archivetype: {
                required: true
            },
            archiveFreq: {
                required: true
            },
            scheduleType: {
                required: true
            },
            dateoccur: {
                required: true
            },
            startdate: {
                required: true
            },
            enddate : {
                greaterStart: "#startdate"
            },
            occurencetype: {
                required: true
            },
            daysinput: {
                required: true
         //,greaterthanzero : true
            },
            every: {
                required: true
            },
            month: {
                required: true
            } 
           
        },
        messages: {
            archivetype : "Required",
            archiveFreq : "Required",
            scheduleType: "Required",
            dateoccur: "Required",
            startdate: "Required",
            occurencetype: "Required",
            daysinput: "Required",
            every: "Required",
            month : "Required"
           

        },
        submitHandler: function (form) {
           
            AddSchedule(form);
            return false;
        }, 
        highlight: function (element) {
            if (!$(element).is(':focus')) {
                $(element).stop()
                          .addClass("inputValidate")
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "-10px" }, 70).animate({ left: "10px" }, 70)
                          .animate({ left: "0px" }, 70);
            }
        },
        unhighlight: function (element) {
            $(element).stop().removeClass("inputValidate");
        }

    });
    
    $("#scheduletype,#dateoccur,#archivetype,#archiveFreq,#scheduletype").on('change', function () {
        var value = $('#scheduletype option:selected').val();
        var dateoccur = $('#dateoccur').val();
        if (value == 'RE') {
            $('#divonetime').hide();
            $('#divfrequency').show();
            
            $("#description").html('');
            $("#summary").val($("#description").html(''));
            GETSUMMARY();
					
        }
        else if (value == 'OT') {
            $('#divonetime').show();
            $('#divfrequency').hide();
            GETSUMMARY();
					//$("#description").val('Occurs on  ' + dateoccur); 
        }
    });
    
    $('.date-picker').datepicker({
        autoclose: true,
        todayHighlight: true
    })
	//show datepicker when clicking on the icon
	.next().on(ace.click_event, function () {
        $(this).prev().focus();
    });
    
    //onetime
    //$("#dateoccur").on('change', function(){
    //var dateoccur = $('#dateoccur').val(); 
    //$("#description").val('Occurs on  ' + dateoccur); 
    //});
    
    //Recurring
    //$
    
    $("#occurence,#startdate,#enddate,#daysinput,#every,#month").on('change', function () {
        var value = $('#occurence option:selected').val();
        var startdate = $('#startdate').val();
        var enddate = $('#enddate').val();
        var dailyday = $('#daysinput').val();
        var weekon = $('#weekon').val();
        var every = $('#every').val();
        var month = $('#month').val();
        switch (value) {
            case 'W':
                $('#days,#monthly').hide();
                $('#weekon,#weeks,#daily').show();
                GETSUMMARY();
                checkedDays();
                //$("#description").val('Occurs every ' + dailyday + ' week' +'.Schedule will be used starting on '+ startdate);
                break;
            case 'D':
                $('#days,#daily').show();
                $('#weekon,#weeks,#monthly').hide();
                //$("#description").val('Occurs every ' + dailyday + ' day' +'.Schedule will be used starting on '+ startdate); 
                GETSUMMARY();
                break;
            case 'M':
                $('#monthly').show();
                $('#weekon,#daily').hide();
                GETSUMMARY();
                break;
        }
    });
    
    $("#archivetype").change(function () {
        //$("#archiveFreq").val('');
        if ($("#archivetype").val() != '') {
            
            if ($("#archivetype").val() == 'AT') {
                $("#archiveFreq option[value = 'FF']").show();
                $("#archiveFreq option[value = 'IF']").hide();
            }
            else if ($("#archivetype").val() == 'AU') {
                $("#archiveFreq option[value = 'FF']").hide();
                $("#archiveFreq option[value = 'IF']").show();
            }
            else if ($("#archivetype").val() == 'F') {
                $("#archiveFreq option[value = 'FF']").hide();
                $("#archiveFreq option[value = 'IF']").show();
            }
            else if ($("#archivetype").val() == 'O') {
                $("#archiveFreq option[value = 'FF']").hide();
                $("#archiveFreq option[value = 'IF']").show();
            }
            else if ($("#archivetype").val() == 'T') {
                $("#archiveFreq option[value = 'FF']").hide();
                $("#archiveFreq option[value = 'IF']").show();
            }
            else {
                $("#archiveFreq option[value = 'FF']").show();
                $("#archiveFreq option[value = 'IF']").show();
            }

        }
    });
    
    $(".recurring-days input[type='checkbox']").on('click', function () {
       
        var msg = '';
        var daysno = '';
        $('input[data="formfield"]:checked').each(function () {                  
            msg += this.name + ',';
            daysno += $(this).val() + ',';            
        });
        daysname = msg;
        daysnumber = daysno.substr(0, daysno.length - 1);
        $('#daysno').val(daysnumber);
       
        GETSUMMARY();
      
    });
    
    $("#btnreset").on('click', function () {

        var ArchiveSetupid = $("#ArchiveSetupID").val();
        window.location.href = '/archiveList/' + ArchiveSetupid;

    });
    
   
    
    
    function checkedDays() {
       
        var daysno = $('#daysno').val();
        var splitDays = [];
        if (daysno != null) {
            splitDays = daysno.split(',');
            if (daysno != '' || daysno != null) {
                $.each(splitDays, function (i, v) {
                    $(".recurring-days input[type='checkbox']").each(function () {
                        if (v == $(this).val()) {
                            $(this).prop('checked', true);

                        }


                    });
                });

            }
        }


    }
    
    function GETSUMMARY() {
        var archivetype = $('#archivetype option:selected').text();
        var archiveFreq = $('#archiveFreq option:selected').text();
        var scheduletype = $('#scheduletype option:selected').text();

        if ($('#scheduletype option:selected').val() == 'OT') {
            var dateoccur = $('#dateoccur').val();
            if (dateoccur != '' && archivetype != '' && archiveFreq != '' && scheduletype != '') {
                $("#description").html('Archiving of '+ archivetype + ' scheduled as ' + scheduletype + ' which Occurs on  ' + dateoccur + ' with ' + archiveFreq + ' data transfer.');
                $("#summary").val($("#description").html());
            }
        }
        if ($('#scheduletype option:selected').val() == 'RE') {
            var dailyday = $('#daysinput').val();
            var startdate = $('#startdate').val();
            var enddate = $('#enddate').val();
            
            if ($('#occurence option:selected').val() == 'D') {
                var msg = '';
                if (dailyday > 1)
                    msg += 'Archiving of ' + archivetype + ' scheduled as ' + scheduletype + ' which Occurs every ' + dailyday + ' day(s)' + ' with ' + archiveFreq + ' data transfer';
                else
                    msg += 'Archiving of ' + archivetype + ' scheduled as ' + scheduletype + ' which Occurs every ' + dailyday + ' day' + ' with ' + archiveFreq + ' data transfer';
                if (startdate != '' && enddate == '') {
                    msg += ' and starting on ' + startdate;
                }
                if (startdate != '' && enddate != '') {
                    msg += ' and effective from ' + startdate + ' to ' + enddate;
                }
                $("#description").html(msg);
                $("#summary").val(msg);
					    
            }
            if ($('#occurence option:selected').val() == 'W') {
                var msg = '';
                
                if (dailyday > 1)
                    msg += 'Archiving of ' + archivetype + ' scheduled as ' + scheduletype + ' which Occurs every ' + dailyday + ' week(s)' + ' with ' + archiveFreq + ' data transfer';
                else
                    msg += 'Archiving of ' + archivetype + ' scheduled as ' + scheduletype + ' which Occurs every ' + dailyday + ' week ' + ' with ' + archiveFreq + ' data transfer';
                
                if (daysname != '')
                    
                    msg += ' on ' + daysname.substr(0, daysname.length - 1);
                if (startdate != '' && enddate == '') {
                    msg += ' and starting on ' + startdate + '.';
                }
                if (startdate != '' && enddate != '') {
                    msg += ' and effective from ' + startdate + ' to ' + enddate + '.';
                }
                //$("#description").val('Occurs every ' + dailyday + ' week' +'.Schedule will be used starting on '+ startdate);
                $("#description").html(msg);
                $("#summary").val(msg);
					    
            }
            //$("#description").val('Occurs every ' + month + ' month' + ' on day ' + every +'.Schedule will be used starting on '+ startdate);
            
            
            if ($('#occurence option:selected').val() == 'M') {
                
                var every = $('#every').val();
                var month = $('#month').val();
                var msg = '';
                
                if (month > 1)
                    msg += 'Archiving of ' + archivetype + ' scheduled as ' + scheduletype + ' which Occurs every ' + month + ' month(s) on Day ' + every + ' of that month' + ' with ' + archiveFreq + ' data transfer';
                else
                    msg += 'Archiving of ' + archivetype + ' scheduled as ' + scheduletype + ' which Occurs every ' + month + ' month on Day ' + every + ' with ' + archiveFreq + ' data transfer';
                if (startdate != '' && enddate == '') {
                    msg += ' and starting on ' + startdate;
                }
                if (startdate != '' && enddate != '') {
                    msg += ' and effective from ' + startdate + ' to ' + enddate;
                }
                $("#description").html(msg);
                $("#summary").val(msg);
			}
		}
	}
    $("#archivetype").trigger('change');
    $("#scheduletype,#dateoccur").trigger('change');
    $("#occurence").trigger('change');

});

function AddSchedule(sender) {
    //if ($('form.form-horizontal').validate().form()) {
    // sender = $(sender).find('button[type="submit"]');
    //$('form.form-horizontal').find('button[type="submit"]').attr('disabled', 'disabled');
    $(sender).find('button[type="submit"]').attr('disabled', 'disabled');
    
    $.ajaxExt({        
        url: '/archive/addUpdateSchedule',
        type: 'POST',
        showErrorMessage: true,
        validate: true,
        formToPost: $(sender),
        messageControl: $('.msg'),
        formToValidate: $(sender),
        showThrobber: true,
        throbberPosition: { my: "left center", at: "right center", of: $(sender).find('button[type="submit"]'), offset: "5 0" },
        containFiles: true,
        success: function (data, msg) {
            //$('.msg').html(data[0]).css({ 'color': 'Green' });
            //window.location.href = data[1];
            window.location.href = '/archiveList/' + data[1];
        },
        error: function () {
            //$('.msg').html(data[0]).css({ 'color': 'Red' });
            $(sender).find('button[type="submit"]').removeAttr('disabled');
        }
    });
    return false;
    //}
    return false
}