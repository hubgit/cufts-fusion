var key = "AIzaSyAuZOPp_xT8ZRpXbMcoGyfae4SiKcb1x8Q";
var doc = "1CreRbmSLv0_o_6bKjdQSpRcN8G01Ngb1peVNWys";

var submitQuery = function(sql) {
	return $.ajax({
		url: "https://www.googleapis.com/fusiontables/v1/query",
		data: {
			key: key,
			sql: sql
		},
		dataType: "json"
	});
};

var renderItem = function(loadingNode, outputNode) {
	loadingNode.show();

	return function(data) {
		var row;
		
		loadingNode.hide();

		data.rows.forEach(function(item) {
			row = $("<tr/>").appendTo(outputNode);
			item.forEach(function(cell) {
				$("<td/>").text(cell ? cell : "").appendTo(row);
			});
		});

		outputNode.closest("table").show();
	};
};

var handleSubmit = function(event) {
	event.preventDefault();

	var sql, 
	    issn, 
	    title,
	    form = $(this),
	    loadingNode = form.find(".loading"),
	    outputNode = form.find(".output");

	switch (form.data("search")) {
		case "issn":
			issn = form.find("input[name=issn]").val().replace(/-/g, "");
			sql = "SELECT file, title FROM " + doc + " WHERE issn = '" + issn + "'";
		break;

		case "title":
			title = form.find("input[name=title]").val();
			sql = "SELECT file, issn, e_issn FROM " + doc + " WHERE title = '" + title + "'";
		break;
	}

	submitQuery(sql).done(renderItem(loadingNode, outputNode));
};

$("form").submit(handleSubmit);
