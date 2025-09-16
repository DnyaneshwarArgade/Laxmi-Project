"use client";
import { Container, Row, Col, Table } from "reactstrap";
import styles from "./invoice.module.css";

export default function ViewInvoice({ invoice }) {
  console.log("Rendering ViewInvoice with invoice:", invoice);
  const customerName = invoice?.customer?.name || "";
  const invoiceId = invoice?.id || "";
  const invoiceDate = invoice?.date || "";
  const items = invoice?.items || [];
  const totalAmount = invoice?.total_amount || "";
  const unpaidAmount = invoice?.unpaid_amount || "";
  return (
    <main className={styles.page}>
      <Container className={styles.sheet} fluid="sm">
        <Row className={styles.headerTop}>
          <Col xs="12" className={styles.brandBlock}>
            <div className={styles.brandRow}>
              {/* Decorative icon placeholder (top-left in the photo) */}
              {/* <div className={styles.iconPlaceholder}>
                <img src={Logo} alt="Logo" />
              </div> */}
              <div className={styles.brandText}>
                <div className={styles.subHead}>
                  {"प्रोप्रा. रविंद्र भुसारे | मो.९८५०८३७४००/९८५०३३२३५६"}
                </div>
                <h1 className={styles.brandTitle}>{"लक्ष्मी जनरल स्टोअर्स"}</h1>
                <div className={styles.tagline}>
                  {
                    "शालेयपयोगी, गृहपयोगी, ऑफीस मटेरिअल व सौंदर्य प्रसाधनांचे विक्रेते प्रेझेंटेशन आर्टिकल, रिस्टरवॉच, वॉल क्लॉक (रेसिडेन्शियल हायस्कूल समोर,मिरी रोड, शेवगाव, जि. अहिल्यानगर ४१४५०२)"
                  }
                </div>
              </div>
            </div>

            <div className={styles.metaRow}>
              <div className={styles.metaLeft}>
                {"क्र."}{" "}
                <span className={styles.metaLine}>INV_{invoiceId}</span>
              </div>
              <div className={styles.metaRight}>
                {"दि."} <span className={styles.metaLine}>{invoiceDate}</span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <hr className={styles.ruleThick} />
          </Col>
        </Row>
        <Row className={styles.billToRow}>
          <Col xs="12">
            {"श्री "}
            <span className={styles.metaLineWide}>{customerName}</span>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Table bordered className={styles.itemsTable}>
              <thead>
                <tr>
                  <th className={styles.colSno}>{"अ. नं."}</th>
                  <th className={styles.colDesc}>{"तपशील"}</th>
                  <th className={styles.colQty}>{"नग"}</th>
                  <th className={styles.colRate}>{"दर"}</th>
                  <th className={styles.colAmt}>{"रकम रुपये"}</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0
                  ? items.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.description || ""}</td>
                        <td>{item.quantity || ""}</td>
                        <td>{item.rate || ""}</td>
                        <td>{item.amount || ""}</td>
                      </tr>
                    ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className={styles.rowBlank}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className={styles.amountWordsRow}>
          <Col xs="12">
            {"अक्षरी रुपये"}{" "}
            <span className={styles.metaLineWide}>{totalAmount}</span>
          </Col>
        </Row>
        <Row className={styles.footerNotes}>
          <Col xs="8" className={styles.noteLeft}>
            <div>{"रोख मिळाले/येणे बाकी."}</div>
            <div>{"धन्यवाद!..."}</div>
            <div>{unpaidAmount ? `बाकी रक्कम: ${unpaidAmount}` : null}</div>
          </Col>
          <Col xs="4" className={styles.noteRight}>
            <div className={styles.signLine}>{"माल घेऊन गेल्याची सही"}</div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs="12">
            <hr className={styles.ruleThick} />
            <div className={styles.bottomBrand}>
              {"लक्ष्मी जनरल स्टोअर्स करिता"}
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
