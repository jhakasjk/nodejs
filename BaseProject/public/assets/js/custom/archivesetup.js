
$(function () {
    $('#dynamic-table tbody').find('button.save').hide();
    $('#dynamic-table tbody').find('button.delete').hide();
    
    $('ul.nav-list li').removeClass('active');
    $('ul.nav-list li.archivesetup').addClass('active');
    
    
    //$(this).parents('tr.tblrow').each(function () {
        
    //    $(this).parents('td').find('span.lbl').show();
    //    $(this).parents('td').find('input[type="text"]').hide();
    //    $(this).parents('td').find('select#corpid').hide();
    //});
});


function editArchiveSetup(sender) {
    $(sender).parents('td').find('button.edit').hide();
    $(sender).parents('td').find('button.save').show();
    $(sender).parents('td').find('button.delete').show();
    
    $(sender).parents('tr.tblrow').find('span.lbl').each(function () {
        //$(this).parents('td').find('input[type="text"],select').removeattribute('style');
        $(this).parents('td').find('input[type="text"],select').show();
        //$(this).parents('td').find('select option:selected').show();
        $(this).hide();
        //$(this).parents('td').find('select')
    });
}

function saveArchiveSetup(sender) {
    var jsonObj = [];
    var item;
    var Haserror = false;
    
    var savebutton = $(sender).parents('td').find('button.save');
    var editbutton = $(sender).parents('td').find('button.edit');
    var deletebutton = $(sender).parents('td').find('button.delete');
    var corpidval = $(sender).parents('tr.tblrow').find('select option:selected').val();
    var corpidtext = $(sender).parents('tr.tblrow').find('select option:selected').text();
    $(sender).parents('tr.tblrow').find('input[type="text"]').each(function () {
        if ($(this).val().trim() == '') {
            $(this).css({ 'border-color': 'red' });
            Haserror = true;
        }
        else {
            var regex = /^[0-9\b]+$/;
            if ($(this).attr("name") == "ProdEmployerId" && !regex.test($(this).val())) {
                $(this).css({ 'border-color': 'red' });
                Haserror = true;
            }
            else if ($(this).attr("name") == "ArchEmployerid" && !regex.test($(this).val())) {
                $(this).css({ 'border-color': 'red' });
                Haserror = true;
            }
            else {
                $(this).css({ 'border-color': '#d5d5d5' });
            }
        }
    });
    if (!Haserror) {
        $(sender).parents('tr.tblrow').find('input[type="text"],select').each(function () {
            if ($(this).is('input')) {
                var id = $(this).attr("name");
                var value = $(this).val();                
                item = id + ':' + value;
                jsonObj.push(item);                
                $(this).parents('td').find('span.lbl').text($(this).val()).show();
                $(this).hide();
            } else if ($(this).is('select')) {
                var val = $(this).val();
                $(this).parents('td').find('span.lbl').text($(this).parents('tr.tblrow').find('select option:selected').text()).show();
                $(this).hide();
            }
        });
        
        item = 'ArchiveSetupID' + ':' + $(sender).parents('tr.tblrow').find('#ArchiveSetupID').val();
        jsonObj.push(item);
        item = 'EmployerId' + ':' + corpidval;
        jsonObj.push(item);
        item = 'CorpId' + ':' + corpidtext;
        jsonObj.push(item);   

        $.ajaxExt({
            url: '/archivesetup/save',
            type: 'POST',
            data: { savebtn : jsonObj },
            contentType: 'application/json',
            showErrorMessage: true,
            messageControl: $('.common-msg'),
            showThrobber: true,
            throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
            containFiles: false,
            success: function (results, op) {
                $(sender).parents('tr.tblrow').find('button.btn-warning').attr('onclick', "window.location.href='/archiveList/" + op.ID + "'");
                editbutton.show();
                savebutton.hide();
                deletebutton.hide();
                //window.location.href = '/archivesetup';
            },
            error: function () {
                //$('.msg').html(data[0]).css({ 'color': 'Red' });
            }
        });
        return false;
    }
}

function addNewRow(sender) {
    var ddl = '<select class="form-control grid-select" name="corpid" id="corpid" onchange="setEmployer(this)">';
    var employerJson = JSON.parse($('.Employers').val());
    $.each(employerJson, function (i) {
        ddl += '<option value="' + employerJson[i].EmployerId + '">' + employerJson[i].AccountName + '</option>';
    });
    ddl += '</select>';
    var str = '<tr class="tblrow" method="post"><input type="hidden" name="ArchiveSetupID" id="ArchiveSetupID"><td class="center"><div class="hidden-sm hidden-xs btn-group"><button class="edit btn btn-xs btn-info" title="Edit" name="edit" onclick="editArchiveSetup(this)" style="display: none;"><i class="ace-icon fa fa-pencil bigger-120"></i></button>&nbsp;<button class="delete btn btn-xs btn-danger" title="Cancel" name="delete" onclick="deleteArchiveSetup(this)" style="display: block;"><i class="ace-icon fa fa-trash-o bigger-120"></i></button>&nbsp;<button class="save btn btn-xs btn-success" title="Save" name="save" onclick="saveArchiveSetup(this)" style="display: block;"><i class="ace-icon fa fa-check bigger-120"></i></button></div></td><td class="center"><label class="pos-rel">' +
                ddl + 
               '</label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" readonly="readonly" style="" name="ProdEmployerId"></label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" required="" style="" name="ProdServer"></label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" required="" style="" name="ProdDatabase"></label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" required="" style="" name="StagingServer"></label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" required="" style="" name="StagingDatabase"></label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" style="" name="ArchEmployerid"></label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" style="" name="ArchServer"></label><span class="lbl" style="display: none;"></span></td><td class="center"><label class="pos-rel"><input type="text" class="grid-text" style="" name="ArchDatabase"></label><span class="lbl" style="display: none;"></span></td><td class="center"><div class="hidden-sm hidden-xs btn-group"><button class="edit btn btn-xs btn-warning" name="Schedule" title="View Schedule"><i class="ace-icon fa fa-calendar bigger-120"></i></button></div></td></tr>';
    $('#dynamic-table tbody').append(str);
    $('select.form-control').trigger('change');
}

function setEmployer(sender) {
    $(sender).parents('tr').find('input[name="ProdEmployerId"]').val($(sender).val());
}

function deleteArchiveSetup(sender) {
    var setupid = $(sender).parents('tr.tblrow').find('input[type="hidden"]').val();
    if (setupid != '') {
        $(sender).parents('td').find('button.edit').show();
        $(sender).parents('td').find('button.save').hide();
        $(sender).parents('td').find('button.delete').hide();
        $(sender).parents('tr.tblrow').find('input[type="text"],select').each(function () {
            //$(sender).parents('td').find('input[type="text"],select').removeattribute('style');
            $(this).parents('td').find('span.lbl').show();
            if ($(this).is('input[type="text"]')) {
                $(this).val(($(this).parents('td').find('span.lbl').text()));
            }
                      
            $(this).hide();
               // $(sender).parents('td').find('select option:selected').show();
                
        });
            //$.ajaxExt({
            //    url: '/archivesetup/delete',
            //    type: 'POST',
            //    data: { archSetupId : setupid },
            //    contentType: 'application/json',
            //    showErrorMessage: true,
            //    messageControl: $('.common-msg'),
            //    showThrobber: true,
            //    //throbberPosition: { my: "left center", at: "right center", of: sender, offset: "5 0" },
            //    containFiles: false,
            //    success: function () {
            //        window.location.href = window.location.href;
            //    },
            //    error: function () {
            //    //$('.msg').html(data[0]).css({ 'color': 'Red' });
            //    }
            //});
    }
    else {
        $(sender).parents('tr.tblrow').remove();

    }
}
