$(document).ready(function() {
    var fromLocationInput = $("#fromLocation");
    var toLocationInput = $("#toLocation");
  
    fromLocationInput.on("input", function() {
      var input = fromLocationInput.val().trim();
      if (input.length >= 2) {
        $.get("/api/from-options?input=" + input, function(data) {
          var options = "";
          data.forEach(function(option) {
            options += "<a>" + option + "</a>";
          });
          $("#fromLocationDropdown").html(options);
          $(".dropdown").addClass("open");
          $("#toLocationDropdown").empty(); // Clear the options in the "To" location dropdown
        });
      } else {
        $(".dropdown").removeClass("open");
        $("#toLocationDropdown").empty(); // Clear the options in the "To" location dropdown
      }
    });
  
    toLocationInput.on("input", function() {
      var input = toLocationInput.val().trim();
      if (input.length >= 2) {
        $.get("/api/to-options?input=" + input, function(data) {
          var options = "";
          data.forEach(function(option) {
            options += "<a>" + option + "</a>";
          });
          $("#toLocationDropdown").html(options);
          $(".dropdown").addClass("open");
          $("#fromLocationDropdown").empty(); // Clear the options in the "From" location dropdown
        });
      } else {
        $(".dropdown").removeClass("open");
        $("#fromLocationDropdown").empty(); // Clear the options in the "From" location dropdown
      }
    });
  
    $("#findBusesButton").click(function() {
      var fromLocation = fromLocationInput.val().trim();
      var toLocation = toLocationInput.val().trim();
  
      if (fromLocation.length > 0 && toLocation.length > 0) {
        $.post("/api/find-buses", { fromLocation: fromLocation, toLocation: toLocation }, function(data) {
          var busDetails = "<h3>Available Buses</h3>";
          busDetails += "<ul>";
          data.forEach(function(bus) {
            busDetails += "<li>" + bus["BUS_NUMBERS"] + " - From: " + bus["FROM_LOCATION"] + ", To: " + bus["DESTINATION"] + ", Kilometers: " + bus["DISTANCE"] + "</li>";
          });
          busDetails += "</ul>";
  
          $("#busDetails").html(busDetails);
        });
      }
    });
  
    $(document).on("click", "#fromLocationDropdown a", function() {
      var selectedOption = $(this).text();
      fromLocationInput.val(selectedOption);
      $(".dropdown").removeClass("open");
      $("#toLocationDropdown").empty(); // Clear the options in the "To" location dropdown
    });
  
    $(document).on("click", "#toLocationDropdown a", function() {
      var selectedOption = $(this).text();
      toLocationInput.val(selectedOption);
      $(".dropdown").removeClass("open");
      $("#fromLocationDropdown").empty(); // Clear the options in the "From" location dropdown
    });
  
    // Close dropdown when clicking outside
    $(document).click(function(event) {
      var target = $(event.target);
      if (!target.closest(".dropdown").length && !target.is("#fromLocation") && !target.is("#toLocation")) {
        $(".dropdown").removeClass("open");
        $("#fromLocationDropdown").empty(); // Clear the options in the "From" location dropdown
        $("#toLocationDropdown").empty(); // Clear the options in the "To" location dropdown
      }
    });
  });
  