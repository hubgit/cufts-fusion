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
		loadingNode.hide();

		data.rows.forEach(function(item) {
			var row = $("<tr/>").appendTo(outputNode);
			item.forEach(function(cell) {
				if (!cell) cell = "";
				$("<td/>").text(cell).appendTo(row);
			});
		});

		outputNode.closest("table").show();
	};
};

var handleSubmit = function(event) {
	event.preventDefault();

	var sql, form = $(this);

	switch (form.data("search")) {
		case "issn":
			var issn = form.find("input[name=issn]").val().replace(/-/g, "");
			sql = "SELECT file, title FROM " + doc + " WHERE issn = '" + issn + "'";
		break;

		case "title":
			var title = form.find("input[name=title]").val();
			sql = "SELECT file, issn, e_issn FROM " + doc + " WHERE title = '" + title + "'";
		break;
	}

	var loadingNode = form.find(".loading");
	var outputNode = form.find(".output");

	submitQuery(sql).done(renderItem(loadingNode, outputNode));
};

$("form").submit(handleSubmit);
