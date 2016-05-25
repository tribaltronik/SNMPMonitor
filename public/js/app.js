/*
* Client app.js
* Auhtor: Tiago Ricardo
*/

function GetDeviceInfo()
{
    $.ajax({
        type: "GET",
        dataType: "json",
		timeout: 5000,
        url: "/devices",
        success: function (data) {
            // replace div's content with returned data
			console.log(data);
			
			for (var i = 0; i < data.length; i++) 
            {
                var activestate='<span class="label label-danger">Not running</span>';
                if(data[i].running == "true")
                {
                    activestate = '<span class="label label-success">Running</span>';
                }
	
                $("#devicesGridview").append("<tr><td>" + data[i].local + "</td><td>" + data[i].name + "</td><td><a href='http://"+ data[i].ip +"' target='_blank'>" + data[i].ip + "</a></td><td>" + activestate + "</td><td>" + data[i].version + "</td><td>" + data[i].serialnumber + "</td></tr>");
            }
        },
		error: function (xhr,status,error){
			alert('erro:' + error);
			$("#loading").css("display", "none");
		}
    });
}
