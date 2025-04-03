import { format } from "date-fns";

interface InvitationCardProps {
  title: string;
  address: string;
  activityDate: Date;
  primaryColor: string;
  backgroundColor: string;
  secondaryColor: string;
  fontFamily: string;
  italicize: boolean;
  backgroundGradient: boolean;
  secondaryGradient: boolean;
  backgroundImage?: File | string;
  acceptanceLabel: string;
  rejectionLabel: string;
  isEdit: boolean;
}

export const InvitationCard = ({
  title,
  address,
  activityDate,
  primaryColor,
  backgroundColor,
  secondaryColor,
  fontFamily,
  italicize,
  backgroundGradient,
  secondaryGradient,
  backgroundImage,
  acceptanceLabel,
  rejectionLabel,
  isEdit = true,
}: InvitationCardProps) => {
  const getBackgroundStyle = () => {
    if (backgroundImage) {
      if (typeof backgroundImage === "string") {
        // Handle URL string case
        return `url(${backgroundImage}) center/cover no-repeat`;
      } else if (backgroundImage instanceof File) {
        // Handle File object case
        return `url(${URL.createObjectURL(
          backgroundImage,
        )}) center/cover no-repeat`;
      }
    }
    if (backgroundGradient) {
      return `linear-gradient(135deg, ${backgroundColor}, ${secondaryColor})`;
    }
    return backgroundColor;
  };

  const backgroundImageStyle = getBackgroundStyle();

  const styleBackgroundCard = {
    backgroundColor,
    background: backgroundImageStyle,
  };

  return (
    <div
      className="border rounded-lg h-[40rem] w-full overflow-hidden"
      data-oid="kh-o2ep"
    >
      <div
        className="h-full relative flex flex-col items-center justify-between"
        style={styleBackgroundCard}
        data-oid="y1s01y2"
      >
        <div
          className="absolute h-3/4 w-4/5 m-auto inset-0 bg-white/60 rounded-sm"
          data-oid="ztlql2i"
        >
          <div
            className="relative z-10 flex flex-col items-center justify-between h-full py-8 px-6 text-center"
            data-oid="ehcwuna"
          >
            <div className="mt-4" data-oid=".y_j73p">
              <h3
                style={{
                  color: primaryColor,
                  fontFamily,
                  fontStyle: italicize ? "italic" : "normal",
                  fontSize: "2rem",
                  fontWeight: "500",
                }}
                data-oid="jbw5gpo"
              >
                {title || "Event Title"}
              </h3>
            </div>

            <div className="my-4" data-oid="l81er9q">
              <p
                style={{
                  color: primaryColor,
                  fontFamily,
                  fontStyle: italicize ? "italic" : "normal",
                  fontSize: "1rem",
                  marginBottom: "8px",
                }}
                data-oid="jrgh-11"
              >
                {address || "Event Address"}
              </p>

              <h2
                style={{
                  color: primaryColor,
                  fontFamily,
                  fontStyle: italicize ? "italic" : "normal",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  marginTop: "16px",
                  marginBottom: "16px",
                }}
                data-oid="m739uj1"
              >
                {format(activityDate, "dd MMM, yyyy")}
              </h2>
            </div>

            <div className="mb-4 w-[50%]" data-oid="v--s55i">
              <div className="mb-4" data-oid="xyeoi7k">
                <p
                  style={{
                    color: primaryColor,
                    fontFamily,
                    marginBottom: "4px",
                    fontSize: "14px",
                    textAlign: "start",
                  }}
                  data-oid="ir8t4c8"
                >
                  Your name
                </p>
                <div
                  className="w-full border-b-2 mx-auto"
                  style={{
                    borderColor: primaryColor,
                    width: "100%",
                  }}
                  data-oid="h:rqv88"
                ></div>
              </div>

              <div
                className="flex justify-center gap-60 mt-6"
                data-oid="4.4c-41"
              >
                <div className="flex items-center gap-2" data-oid="8-96rok">
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ borderColor: primaryColor }}
                    data-oid="mu72aty"
                  ></div>
                  <span
                    style={{
                      color: primaryColor,
                      fontFamily,
                      fontStyle: italicize ? "italic" : "normal",
                    }}
                    data-oid="9.qmft6"
                  >
                    {acceptanceLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2" data-oid="e4zi1uw">
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ borderColor: primaryColor }}
                    data-oid="_5-te4j"
                  ></div>
                  <span
                    style={{
                      color: primaryColor,
                      fontFamily,
                      fontStyle: italicize ? "italic" : "normal",
                    }}
                    data-oid=":m7s4ns"
                  >
                    {rejectionLabel}
                  </span>
                </div>
              </div>

              <button
                disabled={!isEdit}
                className="mt-6 px-6 py-2 rounded cursor-pointer mx-auto block"
                style={{
                  backgroundColor: secondaryColor,
                  background: secondaryGradient
                    ? `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`
                    : secondaryColor,
                  color: "#FFFFFF",
                  fontFamily,
                  fontStyle: italicize ? "italic" : "normal",
                }}
                data-oid="aw1kmjd"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
