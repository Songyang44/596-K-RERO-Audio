import React, { useEffect, useState, useContext } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { deleteFile } from "@inrupt/solid-client";
import {
  getSolidDatasetWithAcl,
  Access,
  saveAclFor,
  setAgentAccess,
} from "@inrupt/solid-client";
import { acp_ess_2 } from "@inrupt/solid-client";

import {
  getSolidDataset,
  getThingAll,
  getThing,
  getUrlAll,
  deleteSolidDataset,
  getContainedResourceUrlAll,
  deleteContainer,
  getFile,
} from "@inrupt/solid-client";
import { PostContext } from "../PostContext/PostContext";
import "../DisplayPost/DisplayPost.css";
import lockIcon from "../../../resources/locked.png";
import unLockIcon from "../../../resources/unlocked.png";

function DisplayPost() {
  const { session } = useSession();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pod, setPod] = useState(""); // State to store the pod URL
  const { post } = useContext(PostContext);
  const [copied, setCopied] = useState({});
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [addedContacts, setAddedContacts] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputUrl, setInputUrl] = useState(""); // 保存用户输入的URL
  const [isInputModalVisible, setIsInputModalVisible] = useState(false); // 控制输入模态框的显示
  const [defaultUrl, setDefaultUrl] = useState("");
  const [statusimg, setStatusImg] = useState("");
  const [postStatus, setPostStatus] = useState({});
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [currentPostUrl, setCurrentPostUrl] = useState(null);

  const [postFilesVisible, setPostFilesVisible] = useState({});

  const [postFiles, setPostFiles] = useState({});

  const togglePostFiles = async (postUrl) => {
    if (postFilesVisible[postUrl]) {
      setPostFilesVisible((prevVisible) => ({
        ...prevVisible,
        [postUrl]: false,
      }));
    } else {
      const files = await fetchPostFiles(postUrl);

      setPostFiles((prevFiles) => ({
        ...prevFiles,
        [postUrl]: files,
      }));

      setPostFilesVisible((prevVisible) => ({
        ...prevVisible,
        [postUrl]: true,
      }));
    }
  };
  const fetchPostFiles = async (postUrl) => {
    try {
      const dataset = await getSolidDataset(postUrl, {
        fetch: session.fetch,
      });
      const things = getThingAll(dataset);
      const postFiles = things.map((thing) => {
        const urlParts = thing.url.split("/");
        const name = decodeURIComponent(urlParts[urlParts.length - 1]);
        return { name, url: thing.url };
      });
      return postFiles;
    } catch (error) {
      console.error("Error fetching post files:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!session) return;

    // Fetch and set pod URL
    (async () => {
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
    })();
  }, [session]);

  useEffect(() => {
    setStatusImg("lock.png");
    if (!session || !pod) return;
    const folderUrl = `${pod}Kōrero on the Couch/Posts/`;
    setCurrentUrl(folderUrl);
    setDefaultUrl(folderUrl);
    async function fetchData() {
      try {
        setLoading(true);
        const dataset = await getSolidDataset(folderUrl, {
          fetch: session.fetch,
        });
        const things = getThingAll(dataset);

        const fileInfos = things
          .filter((thing) => thing.url !== folderUrl)
          .map((thing) => {
            const urlParts = thing.url.split("/");
            const name = decodeURIComponent(urlParts[urlParts.length - 2]);
            return { name, url: thing.url };
          });

        setFiles(fileInfos);
      } catch (err) {
        console.error("Error fetching data from pod:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    const fetchContacts = async () => {
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
        setContacts(text.split("\n"));
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchData();
    fetchContacts();
    console.log(contacts);
  }, [pod, session]);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied((currentCopied) => ({ ...currentCopied, [index]: true }));
      setTimeout(
        () =>
          setCopied((currentCopied) => ({ ...currentCopied, [index]: false })),
        2000
      );

      return { url: text, index };
    } catch (err) {
      console.error("Failed to copy: ", err);
      return "";
    }
  };

  const deletePostFolder = async (folderUrl, index) => {
    try {
      if (!folderUrl) throw new Error("Folder URL is null.");

      const resources = await getContainedResourceUrlAll(folderUrl, {
        fetch: session.fetch,
      });

      if (!resources)
        throw new Error("Failed to get resources from the folder.");

      for (const resourceUrl of resources) {
        if (!resourceUrl) throw new Error("Resource URL is null.");
        await deleteFile(resourceUrl, { fetch: session.fetch });
      }

      await deleteContainer(folderUrl, { fetch: session.fetch });
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete folder: ", err);
      setError(`删除失败: ${err.message}`);
    }
  };

  const handleDelete = async (file, index) => {
    console.log(file);
    console.log(index);
    deletePostFolder(file, index);
  };

  async function setAccessForPost(postUrl, isPublic, webId = null) {
    try {
      let datasetWithAcr = await acp_ess_2.getSolidDatasetWithAcr(postUrl, {
        fetch: session.fetch,
      });
      let policy = acp_ess_2.createResourcePolicyFor(
        datasetWithAcr,
        "resource-policy"
      );

      if (isPublic) {
        let matcher = acp_ess_2.createResourceMatcherFor(
          datasetWithAcr,
          "public-matcher"
        );
        matcher = acp_ess_2.setPublic(matcher);
        policy = acp_ess_2.addAllOfMatcherUrl(policy, matcher);
        policy = acp_ess_2.setAllowModes(policy, { read: true });
      } else {
        let matcher = acp_ess_2.createResourceMatcherFor(
          datasetWithAcr,
          "agent-matcher"
        );
        matcher = acp_ess_2.addAgent(matcher, webId);
        policy = acp_ess_2.addAllOfMatcherUrl(policy, matcher);
        policy = acp_ess_2.setAllowModes(policy, { read: true });
      }

      datasetWithAcr = acp_ess_2.addPolicyUrl(datasetWithAcr, policy);
      await acp_ess_2.saveAcrFor(datasetWithAcr, { fetch: session.fetch });
    } catch (error) {
      console.error("Error setting access:", error);
    }
  }

  const makePostPublic = async () => {
    if (currentPostUrl) {
      await setAccessForPost(currentPostUrl, true);
      setPostStatus({ ...postStatus, [currentPostUrl]: true });
      alert("The post has been set to public.");

      setIsConfirmModalVisible(false);
    }
  };

  const handleMakePublicClick = (postUrl) => {
    setIsConfirmModalVisible(true);
    setCurrentPostUrl(postUrl);
  };

  const grantAccessToContact = async (postUrl) => {
    const selectedContact = selectedContacts[postUrl];
    if (selectedContact) {
      await setAccessForPost(postUrl, false, selectedContact);
      alert("success set up");
    } else {
      console.error("No contact selected for this post");
    }
  };

  const handleRemoveContact = (postUrl, contactIndex) => {
    setAddedContacts((prevContacts) => {
      const updatedContacts = prevContacts[postUrl].filter(
        (_, index) => index !== contactIndex
      );
      return { ...prevContacts, [postUrl]: updatedContacts };
    });
  };

  const openModal = (postUrl) => {
    setModalInfo({
      ...modalInfo,
      [postUrl]: { isVisible: true, selectedContact: null },
    });
  };

  const closeModal = (postUrl) => {
    setModalInfo({
      ...modalInfo,
      [postUrl]: { ...modalInfo[postUrl], isVisible: false },
    });
  };

  const selectContact = (postUrl, contactUrl) => {
    setModalInfo({
      ...modalInfo,
      [postUrl]: { ...modalInfo[postUrl], selectedContact: contactUrl },
    });
  };

  const addContact = async (postUrl) => {
    const selectedContact = modalInfo[postUrl]?.selectedContact;
    if (selectedContact) {
      setAddedContacts({
        ...addedContacts,
        [postUrl]: [...(addedContacts[postUrl] || []), selectedContact],
      });
      closeModal(postUrl);

      await grantAccessToContact(postUrl, selectedContact);
    }
  };

  if (loading) {
    return (
      <>
        <p className="loading-message">Loading</p>
      </>
    );
  }

  if (error) {
    return <p className="error-message">错误: {error}</p>;
  }

  const handleSubmitUrl = async () => {
    setIsInputModalVisible(false);

    try {
      setLoading(true);
      const dataset = await getSolidDataset(inputUrl, {
        fetch: session.fetch,
      });
      const things = getThingAll(dataset);
      const fileInfos = things
        .filter((thing) => thing.url !== inputUrl)
        .map((thing) => {
          const urlParts = thing.url.split("/");
          const name = decodeURIComponent(urlParts[urlParts.length - 2]);
          return { name, url: thing.url };
        });

      setFiles(fileInfos);
      setCurrentUrl(inputUrl);
    } catch (err) {
      console.error("Error fetching data from pod:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDefaulttUrl = async () => {
    try {
      setLoading(true);
      const dataset = await getSolidDataset(defaultUrl, {
        fetch: session.fetch,
      });
      const things = getThingAll(dataset);
      const fileInfos = things
        .filter((thing) => thing.url !== defaultUrl)
        .map((thing) => {
          const urlParts = thing.url.split("/");
          const name = decodeURIComponent(urlParts[urlParts.length - 2]);
          return { name, url: thing.url };
        });

      setFiles(fileInfos);
      setCurrentUrl(defaultUrl);
    } catch (err) {
      console.error("Error fetching data from pod:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-url-header">
        Current Container URL: <p className="url-display">{currentUrl}</p>
        <div className="buttons-container ">
          <button
            className="button"
            onClick={() => setIsInputModalVisible(true)}
          >
            Change URL
          </button>
          <button className="button" onClick={handleDefaulttUrl}>
            My Pod
          </button>
        </div>
      </div>
      {isInputModalVisible && (
        <div className="input-modal">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter URL"
          />

          <button onClick={() => handleSubmitUrl()}>Jump</button>
          <button onClick={() => setIsInputModalVisible(false)}>Close</button>
        </div>
      )}
      <div className="displayPost-container">
        {files.map((file, index) => (
          <div key={index} className="displayPost-file">
            <div className="displayPost-file-content">
              <p>Post Name: {file.name}</p>
              <p>URL: {file.url}</p>

              <img
                className="post-status-icon "
                src={postStatus[file.url] ? unLockIcon : lockIcon}
                alt={postStatus[file.url] ? "Unlocked Icon" : "Locked Icon"}
              />
              <div className="post-actions">
                <button onClick={() => togglePostFiles(file.url)}>
                  {postFilesVisible[file.url] ? "Hide Files" : "Show Files"}
                </button>
              </div>

              {postFilesVisible[file.url] && (
                <div className="post-files-list">
                  {postFiles[file.url] ? (
                    postFiles[file.url].map((postFile) => (
                      <div key={postFile.url} className="post-file-item">
                        <p>File Name:{postFile.name}</p>
                        <p
                          className={copied[postFile.url] ? "copied" : ""}
                          onClick={(e) => copyToClipboard(postFile.url, e)}
                        >
                          URL:{postFile.url}
                        </p>
                        {copied[postFile.url] && <span>Copied!</span>}
                      </div>
                    ))
                  ) : (
                    <p>Loading files...</p>
                  )}
                </div>
              )}
            </div>
            <div className="post-actions">
              {copied[index] && (
                <span className="copied-message active">Copied!</span>
              )}
              <br />
              <button onClick={() => copyToClipboard(file.url, index)}>
                Copy Link
              </button>

              <button onClick={() => handleMakePublicClick(file.url)}>
                Make Public
              </button>
              {isConfirmModalVisible && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <p>
                      Setting this post to public is irreversible. Are you sure?
                    </p>
                    <div className="modal-footer">
                      <button className="modal-button" onClick={makePostPublic}>
                        Confirm
                      </button>
                      <button
                        className="modal-button"
                        onClick={() => setIsConfirmModalVisible(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={() => openModal(file.url)}>
                Grant Access to Contact
              </button>

              {modalInfo[file.url]?.isVisible && (
                <div className="modal">
                  <select
                    className="contact-dropdown"
                    onChange={(e) => selectContact(file.url, e.target.value)}
                    value={modalInfo[file.url]?.selectedContact || ""}
                  >
                    <option value="">Select a contact</option>
                    {contacts.map((contactUrl, idx) => (
                      <option key={idx} value={contactUrl}>
                        {contactUrl}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => addContact(file.url)}>Add</button>
                  <button onClick={() => closeModal(file.url)}>Close</button>
                </div>
              )}

              <div className="added-contacts">
                {addedContacts[file.url]?.map((contact, contactIndex) => (
                  <div key={contactIndex}>
                    {contact}
                    <button
                      onClick={() =>
                        handleRemoveContact(file.url, contactIndex)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default DisplayPost;
