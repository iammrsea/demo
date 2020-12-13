import Event from "@ioc:Adonis/Core/Event";
// import Database from "@ioc:Adonis/Lucid/Database";

// Event.on('db:query', Database.prettyPrint);
Event.on('iterate:trip:request:matching', 'DemandSupplyMatching.onIterateMatching')
Event.on('trip:maximum:rejections', 'DemandSupplyMatching.onMaximumRejections');
Event.on('trip:accepted', 'DemandSupplyMatching.onTripAccepted');
Event.on('trip:driver:matched', 'DemandSupplyMatching.onDriverMatched');
Event.on('trip:canceled', 'DemandSupplyMatching.onTripCanceled');
