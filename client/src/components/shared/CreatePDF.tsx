import {
    Document,
    Font,
    Image,
    Line,
    Page,
    StyleSheet,
    Svg,
    Text,
    View,
} from "@react-pdf/renderer";
import header from "../../assets/Header.jpg";
import { format } from "date-fns";

Font.register({
    family: "specialE",
    src: "http://fonts.gstatic.com/s/specialelite/v6/9-wW4zu3WNoD5Fjka35JmybsRidxnYrfzLNRqJkHfFo.ttf",
});

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        alignContent: "flex-start",
        justifyContent: "flex-start",
        paddingHorizontal: 30,
    },
    section: {
        paddingVertical: 10,
    },
    section2: {
        padding: 10,
        fontSize: 10,
        fontWeight: "normal",
    },
    documentHeader: {
        textDecoration: "underline",
        fontWeight: "extrabold",
        fontSize: 14,
        textAlign: "center",
    },
    image: {
        height: "60rem",
    },
    liabilityView: {
        paddingVertical: 10,
    },
    liability: {
        fontWeight: "bold",
        fontSize: 12,
    },
    liabilityRules: {
        marginLeft: 30,
        fontSize: 10,
    },
    liabilityText: {
        fontWeight: "extralight",
    },
    signatory: {
        paddingVertical: 10,
        fontSize: 10,
        rowGap: 10,
    },
    status: {
        marginTop: 10,
        fontSize: 14,
        rowGap: 4,
    },
});

const CreatePDF = ({ asset }: { asset: IAssetProps | undefined }) => {
    const now = new Date();

    return (
      <Document
        title={asset?.name + " " + "Allocation Form"}
        author="Agnes Muita"
        producer="Agnes Muita"
        creator="Agnes Muita"
        subject={
          "Allocation form for" +
          " " +
          asset?.tag +
          " " +
          "to" +
          " " +
          asset?.user?.fullName
        }
        pdfVersion="1.7"
      >
        <Page size="A4" style={styles.page}>
          <Image style={styles.image} src={header} fixed cache />
          <View style={styles.section}>
            <Text style={styles.documentHeader}>
              COMPANY LAPTOPS ALLOCATION POLICY / AGREEMENT
            </Text>
          </View>
          <View style={styles.section2}>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 5,
                  }}
                >
                  <Text>I</Text>
                  <Text
                    style={{
                      borderBottom: "1px dashed #000",
                      fontFamily: "specialE",
                      width: "180",
                    }}
                  >
                    {asset?.user?.fullName}
                  </Text>
                  <Text>in the day of</Text>
                </View>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    fontFamily: "specialE",
                    width: "120",
                  }}
                >
                  {format(now, "dd/MM/yyyy p")}
                </Text>
                <Text>have received a</Text>
              </View>
              <Text>
                laptop from DEER Limited. I have read aforementioned
                document and agree to follow all policies and standing orders
                that are set forth herein. I further agree to abide by the
                standards set in the document for the period of allocation. I am
                aware that violations of this acceptable use policy may subject
                me to disciplinary action, up to and including discharge from
                employment.
              </Text>
            </View>
          </View>
          <View style={styles.liabilityView}>
            <Text style={styles.liability}>LIABILITY:</Text>
            <View style={styles.liabilityRules}>
              <View style={{ marginTop: 10, rowGap: 4 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>The Laptop remains the property of DEER Limited.</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    The user is liable for the cost of repair or replacement in
                    the event of loss due to theft, damage, negligence or
                    misuse.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                    rowGap: 4,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    Should any faults occur on the company laptop, ICT staff
                    must be informed at the earliest opportunity so that they
                    may undertake any necessary repairs. Under no circumstances
                    should staff attempt to fix suspected hardware faults.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    It’s the responsibility of the user to ensure that all
                    security software’s installed in the laptops are frequently
                    updated to ensure data protection and integrity. ICT staff
                    will advise on the routines and schedule of this operation.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    Full responsibility of surface cleaning (Keyboard, Screen,
                    both rear and back side of the laptops) should be done by
                    the user to ensure that the machine is physically clean.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    DEER Limited policies (a copy may be given by ICT
                    department) regarding appropriate use, data
                    protection,computer misuse and health and safety must be
                    adhered to by all users of the laptop.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    Laptops should not be left unattended; the user must keep
                    the laptop securely.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    By signing this form, the user abides to keep Company
                    information and data confidential; user(s) are not
                    authorized to make copies or forward the information to any
                    unauthorized person or party and shall be liable for damages
                    occurring from the violation of this clause.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.liabilityView}>
            <Text style={styles.liability}>ELIGIBILITY:</Text>
            <View style={styles.liabilityRules}>
              <View style={{ marginTop: 10, rowGap: 4 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    Laptop computer are restricted to only assigned staff(s) or
                    department(s).
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    You may not be assigned a laptop if you have previously
                    violated the DEER Limited Laptop agreement.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.liabilityView}>
            <Text style={styles.liability}>RETURNS:</Text>
            <View style={styles.liabilityRules}>
              <View style={{ marginTop: 10, rowGap: 4 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    All personal files not relating to company work will be
                    deleted and cannot be recovered. Personal Files must be
                    saved to removable media (CD, USB stick, external hard
                    drives) prior to return.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <Text style={styles.liabilityText}>•</Text>
                  <Text>
                    After six months of usage time, the laptop should be
                    returned to ICT office for a period not less than 24 hours
                    for scheduled maintenance.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.signatory}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 5,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                }}
              >
                <Text>Laptop Make</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: 60,
                    fontFamily: "specialE",
                    color: "#000",
                  }}
                >
                  {asset?.manufacturer}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                }}
              >
                <Text>Model</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: 150,
                    fontFamily: "specialE",
                  }}
                >
                  {asset?.model}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                }}
              >
                <Text>Serial Number</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: 150,
                    fontFamily: "specialE",
                  }}
                >
                  {asset?.serialNo}/{asset?.tag}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 20,
                width: "100%",
              }}
            >
              <Text>Specifications</Text>
              <Text
                style={{
                  borderBottom: "1px dashed #000",
                  width: "100%",
                  fontFamily: "specialE",
                }}
              >
                {asset?.specification}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 5,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 20,
                }}
              >
                <Text>Battery S/No</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                >
                  {asset?.batterySNo}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 70,
                }}
              >
                <Text>Adaptor Model & Ratings</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                >
                  {asset?.adaptorRatings}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 20,
                }}
              >
                <Text>Adaptor</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                >
                  WORKING
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 5,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 15,
                }}
              >
                <Text>Accessories</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                >
                  {asset?.accessories}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                }}
              >
                <Text>None</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 5,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 60,
                }}
              >
                <Text>Received by:(signature)</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                }}
              >
                <Text>ID No</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 5,
                }}
              >
                <Text>Date</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 5,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 120,
                }}
              >
                <Text>Passed By Div. Accountant: (Name & signature)</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 15,
                }}
              >
                <Text>Date</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: 250,
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 5,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 120,
                }}
              >
                <Text>Received by IT Department: (Name & signature)</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: "100%",
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 15,
                }}
              >
                <Text>Date</Text>
                <Text
                  style={{
                    borderBottom: "1px dashed #000",
                    width: 250,
                    fontFamily: "specialE",
                  }}
                ></Text>
              </View>
            </View>
          </View>
          <View style={styles.status}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 61,
              }}
            >
              <Text>New</Text>
              <View
                style={{
                  border: "1px solid #000",
                  width: 20,
                  height: 20,
                }}
              >
                {asset?.assetStatus === "New" && (
                  <Svg height="20" width="20">
                    <Line
                      x1="0"
                      y1="0"
                      x2="20"
                      y2="20"
                      strokeWidth={2}
                      stroke="rgb(255,0,0)"
                    />
                  </Svg>
                )}
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 50,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 15,
                }}
              >
                <Text>Reallocated</Text>
                <View
                  style={{
                    border: "1px solid #000",
                    width: 20,
                    height: 20,
                  }}
                >
                  {asset?.assetStatus === "Reallocated" && (
                    <Svg height="20" width="20">
                      <Line
                        x1="0"
                        y1="0"
                        x2="20"
                        y2="20"
                        strokeWidth={2}
                        stroke="rgb(255,0,0)"
                      />
                    </Svg>
                  )}
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: 15,
                }}
              >
                <Text>From</Text>
                <View
                  style={{
                    border: "1px solid #000",
                    width: 250,
                    height: 20,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      paddingTop: 4,
                      fontFamily: "specialE",
                    }}
                  >
                    {asset?.assetStatus === "Reallocated" &&
                      asset?.history[1]?.user?.fullName}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "extralight",
              marginTop: "auto",
              marginLeft: "auto",
              paddingBottom: 2,
            }}
          >
            Document Generated On: {format(now, "dd.MM.yyyy p")}
          </Text>
        </Page>
      </Document>
    );
};

export default CreatePDF;
