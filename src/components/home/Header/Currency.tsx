import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Tabs,
  Tab,
  ListGroup,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import "./currency.css"

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "/img/flags/en.webp" },
  { code: "fr", name: "Français", flag: "/img/flags/fr.webp" },
  { code: "pt", name: "portugais", flag: "/img/flags/pt.webp" },
];

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
];

const LangCurrencyModal: React.FC = () => {
  const [show, setShow] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  );

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    const savedCurrency = localStorage.getItem("currency");

    if (savedLang) {
      const lang = languages.find((l) => l.code === savedLang);
      if (lang) setSelectedLang(lang);
    }

    if (savedCurrency) {
      const curr = currencies.find((c) => c.code === savedCurrency);
      if (curr) setSelectedCurrency(curr);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("language", selectedLang.code);
    localStorage.setItem("currency", selectedCurrency.code);
    setShow(false);
  };

  return (
    <li className=" d-lg-flex d-none position-relative">
      {/* Header button trigger */}
      <a
        className="d-flex align-items-center gap-2  bg-transparent"
        onClick={() => setShow(true)}
      >
        <Image
          src={selectedLang.flag}
          alt={selectedLang.name}
          width={24}
          height={24}
          roundedCircle
        />
        <span className="currency-span">{selectedCurrency.symbol}</span>
      </a>

      {/* Modal with Tabs */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Preferences</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Tabs defaultActiveKey="language" id="pref-tabs" className="mb-3">
            {/* 🌐 Language Tab */}
            <Tab eventKey="language" title="🌐 Language">
              <ListGroup>
                {languages.map((lang) => (
                  <ListGroup.Item
                    key={lang.code}
                    action
                    active={selectedLang.code === lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className="d-flex align-items-center gap-2"
                  >
                    <Image
                      src={lang.flag}
                      alt={lang.name}
                      width={24}
                      height={24}
                      roundedCircle
                    /> 
                    |

                    <span >{lang.name}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab>

            {/* 💰 Currency Tab */}
            <Tab eventKey="currency" title="💰 Currency">
              <Row>
                {currencies.map((curr) => (
                  <Col xs={12} key={curr.code} className="mb-2">
                    <ListGroup.Item
                      action
                      active={selectedCurrency.code === curr.code}
                      onClick={() => setSelectedCurrency(curr)}
                    >
                      {curr.symbol} {curr.name}
                    </ListGroup.Item>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </li>
  );
};

export default LangCurrencyModal;
