import Event from "@ioc:Adonis/Core/Event";
import Database from "@ioc:Adonis/Lucid/Database";

Event.on('db:query', Database.prettyPrint);
// Event.on('delete:project:images', 'ProjectListener.deleteImages');
// Event.on('delete:project:videos', 'ProjectListener.deleteVideos');