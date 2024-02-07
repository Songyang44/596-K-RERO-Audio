import React, { useState, useEffect, useContext } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import {
  getSolidDataset,
  getThing,
  getUrlAll,
  overwriteFile,
  getFile,
} from "@inrupt/solid-client";
import { PostContext } from "../PostContext/PostContext";
import "../Contacts/Contacts.css";

function Contacts() {
  const { session } = useSession();
  const [inputText, setInputText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [pod, setPod] = useState("");

  const { setPost } = useContext(PostContext);

  useEffect(() => {
    if (!session) return;
    const fetchProfileAndContacts = async () => {
      const profileDataset = await getSolidDataset(session.info.webId, {
        fetch: session.fetch,
      });
      const profileThing = getThing(profileDataset, session.info.webId);
      const podsUrls = getUrlAll(
        profileThing,
        "http://www.w3.org/ns/pim/space#storage"
      );

      if (podsUrls.length > 0) {
        setPod(podsUrls[0]);
      }

      // Fetch existing contacts
      const contactFileUrl = `${podsUrls[0]}Kōrero on the Couch/Contacts/contact.txt`;
      try {
        const file = await getFile(contactFileUrl, { fetch: session.fetch });
        const text = await file.text();
        setContacts(text.split("\n").filter(Boolean));
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchProfileAndContacts();
  }, [session]);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    const containerUri = `${pod}Kōrero on the Couch/Contacts/`;
    const textFileUrl = `${containerUri}contact.txt`;

    try {
      const updatedContacts = [...contacts, inputText.trim()].join("\n");
      const textBlob = new Blob([updatedContacts], { type: "text/plain" });
      await overwriteFile(textFileUrl, textBlob, {
        fetch: session.fetch,
        contentType: "text/plain",
      });

      setInputText("");
      setContacts(updatedContacts.split("\n"));
      setPost({ contactUrl: textFileUrl, contactName: inputText.trim() });
    } catch (error) {
      console.error("Error in saving contact:", error);
    }
  };

  const handleDelete = async (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    const updatedContacts = newContacts.join("\n");
    const textBlob = new Blob([updatedContacts], { type: "text/plain" });
    try {
      await overwriteFile(
        `${pod}Kōrero on the Couch/Contacts/contact.txt`,
        textBlob,
        { fetch: session.fetch, contentType: "text/plain" }
      );
      setContacts(newContacts);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="container">
      <div className="input-group">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter website URL"
        />
        <button onClick={handleSubmit}>Add Contact</button>
      </div>
      <h2>Contacts</h2>
      <div>
        {contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <div key={index} className="contact-item">
              {contact}
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No contacts found.</p>
        )}
      </div>
    </div>
  );
}

export default Contacts;
