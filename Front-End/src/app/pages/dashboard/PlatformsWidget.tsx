import React, { useState, useEffect } from 'react';
import { Link2, AlertCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlatformLinkage {
  username: string;
  isVerified: boolean;
  verificationToken: string;
  totalSolved?: number;
}

interface PlatformsWidgetProps {
  onLinkageChanged?: () => void;
  onboardingComplete?: boolean;
}

export function PlatformsWidget({ onLinkageChanged, onboardingComplete = true }: PlatformsWidgetProps) {
  const navigate = useNavigate();
  const [linkages, setLinkages] = useState<Record<string, PlatformLinkage | null>>({
    LeetCode: null,
    GeeksforGeeks: null,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const fetchAllLinkages = async () => {
    const platforms = ["LeetCode", "GeeksforGeeks"];
    try {
      const results = await Promise.all(
        platforms.map(async (plat) => {
          const res = await fetch(`${API_URL}/api/platforms/linkage?platform=${plat}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            return { platform: plat, linkage: data.linkage };
          }
          return { platform: plat, linkage: null };
        })
      );
      
      const newLinkages: Record<string, PlatformLinkage | null> = {};
      results.forEach((item) => {
        newLinkages[item.platform] = item.linkage;
      });
      setLinkages(newLinkages);
    } catch (err) {
      console.error("Error loading linkages in PlatformsWidget:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllLinkages();
    }
  }, [token]);

  const getProfileUrl = (platform: string, username: string) => {
    switch (platform) {
      case "LeetCode":
        return `https://leetcode.com/${username}/`;
      case "GeeksforGeeks":
        return `https://www.geeksforgeeks.org/user/${username}/`;
      default:
        return "#";
    }
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case "LeetCode":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#FFA116]" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
          </svg>
        );
      case "GeeksforGeeks":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#2F8D46]" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
          </svg>
        );
      case "GitHub":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-zinc-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        );
      case "Code360":
        return (
          <svg role="img" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#E07A5F]" xmlns="http://www.w3.org/2000/svg">
            <title>Coding Ninjas</title>
            <path d="M23.198 0c-.499.264-1.209.675-1.79.984a542.82 542.82 0 000 6.242c.995-.526 1.761-.834 1.79-2.066V0zM8.743.181C7.298.144 5.613.65 4.47 1.414c-1.17.8-1.987 1.869-2.572 3.179A16.787 16.787 0 00.9 8.87c-.15 1.483-.128 3.079.025 4.677.27 1.855.601 3.724 1.616 5.456 1.57 2.62 4.313 4.109 7.262 4.19 3.41.246 7.233.53 11.411.807.022-2.005.01-5.418 0-6.25-3.206-.21-7.398-.524-11.047-.782-.443-.043-.896-.056-1.324-.172-1.086-.295-1.806-.802-2.374-1.757-.643-1.107-.875-2.832-.797-4.294.11-1.27.287-2.41 1.244-3.44.669-.56 1.307-.758 2.161-.84 5.17.345 7.609.53 12.137.858.032-1.133.01-3.46 0-6.229C16.561.752 12.776.474 8.743.181zm-.281 9.7c.174.675.338 1.305.729 1.903.537.832 1.375 1.127 2.388.877.76-.196 1.581-.645 2.35-1.282zm12.974 1.04l-5.447.689c.799.739 1.552 1.368 2.548 1.703.988.319 1.78.01 2.308-.777.209-.329.56-1.148.591-1.614zm.842 6.461c-.388.01-.665.198-.87.355.002 1.798 0 4.127 0 6.223.586-.297 1.135-.644 1.793-.998-.005-1.454.002-3.137-.005-4.707a.904.904 0 00-.917-.873z" />
          </svg>
        );
      case "InterviewBit":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5] text-[#00A9E0]" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case "HackerRank":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#2EC866]" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.95 8.002h1.805c.061 0 .111.05.111.111v7.767c0 .061-.05.111-.11.111H9.95c-.061 0-.111-.05-.111-.11v-2.87H7.894v2.87c0 .06-.05.11-.11.11H5.976a.11.11 0 01-.11-.11V8.112c0-.06.05-.11.11-.11h1.806c.061 0 .11.05.11.11v2.869H9.84v-2.87c0-.06.05-.11.11-.11zm2.999 0h5.778c.061 0 .111.05.111.11v7.767a.11.11 0 01-.11.112h-5.78a.11.11 0 01-.11-.11V8.111c0-.06.05-.11.11-.11z" />
          </svg>
        );
      case "Codeforces":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="4" height="10" fill="#3B5998" rx="0.5" />
            <rect x="10" y="5" width="4" height="16" fill="#FF0000" rx="0.5" />
            <rect x="17" y="8" width="4" height="13" fill="#FFC000" rx="0.5" />
          </svg>
        );
      case "CodeChef":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#F0A500]" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.2574.0039c-.37.0101-.7353.041-1.1003.095C9.6164.153 9.0766.4236 8.482.694c-.757.3244-1.5147.6486-2.2176.7027-1.1896.3785-1.568.919-1.8925 1.3516 0 .054-.054.1079-.054.1079-.4325.865-.4873 1.73-.325 2.5952.1621.5407.3786 1.0282.5408 1.5148.3785 1.0274.7578 2.0007.92 3.1362.1622.3244.3235.7571.4316 1.1897.2704.8651.542 1.8383 1.353 2.5952l.0057-.0028c.0175.0183.0301.0387.0482.0568.0072-.0036.0141-.0063.0213-.0099l-.0213-.5849c.6489-.9733 1.5673-1.6221 2.865-1.8925.5195-.1093 1.081-.1497 1.6625-.1278a8.7733 8.7733 0 0 1 1.7988.2357c1.4599.3785 2.595 1.1358 2.6492 1.7846.0273.3549.0398.6952.0326 1.0364-.001.064-.0046.1285-.007.193l.1362.0682c.075-.0375.1424-.107.2059-.1902.0008-.001.002-.002.0028-.0028.0018-.0023.0039-.0061.0057-.0085.0396-.0536.0747-.1236.1107-.1931.0188-.0377.0372-.0866.0554-.1292.2048-.4622.362-1.1536.538-1.9635.0541-.2703.1092-.4864.1633-.7027.4326-.9733 1.0266-1.8382 1.6213-2.6492.9733-1.3518 1.8928-2.5962 1.7846-4.0561-1.784-3.4608-4.2718-4.0017-5.5695-4.272-.2163-.0541-.3233-.0539-.4856-.108-1.3382-.2433-2.4945-.3953-3.6046-.3648zm5.0428 14.3788a9.8602 9.8602 0 0 0-.0326-.9824c-.0541-.703-1.1892-1.46-2.7032-1.8386-.588-.1336-1.1764-.2142-1.7448-.2356-.539-.0137-1.0657.0248-1.5546.1277-1.2436.2704-2.2162.9193-2.811 1.8925l.0511 1.431c.6672-.3558 1.7326-.8747 3.139-.9994.0662-.0059.1368-.0059.2044-.0099.1177-.013.2667-.044.4444-.044 1.6075 0 3.2682.5336 4.8767 1.6483.039-.2744.0611-.549.071-.8234l.044.0227c.0028-.0622.0143-.1268.0156-.1888zM11.256.0578c.1239-.0034.2538.01.379.0114-.23-.0022-.4588.0026-.6871.0156.103-.0061.2046-.0242.308-.027zm.4983.0156c.6552.014 1.3255.0711 2.0387.1803-.6834-.0987-1.3646-.1671-2.0387-.1803zm-1.3147.0554c-.076.0087-.1527.0133-.2285.0241-.8168.1167-1.7742.7015-2.75 1.045.3545-.1323.7143-.2957 1.0747-.4501C9.0765.4774 9.6705.207 10.1571.1529c.0939-.0139.1886-.0133.2825-.0241zm-.2285.24c.1622 0 .3787-.0002.5409.0539-.1425-.0357-.2595-.026-.3706-.0142a1.174 1.174 0 0 1 .3166.0681c.5796 1.0012-.4264 5.2791-.6786 8.1492.1559 1.0276.3138 1.9963.4628 2.7201-.7029-1.7843-1.4067-4.921-1.5148-7.354-.054-.9733.001-1.8386.2172-2.4874C9.401.8557 9.7244.4228 10.2111.3687zm3.1361.271c-.811 2.1088-.9184 6.1092-.9725 7.3528-.054.5407-.0001 1.73.054 2.5952 0 .2163.054.4325.054.6488 0-.2163-.054-.3786-.054-.5948-.4326-3.2442-.974-7.1362.9185-10.002zm3.352.3777c-.2704 2.1628-1.4047 3.191-1.7832 5.2998-.1081 1.6762-.325 3.6222-.379 5.2984-.0541-1.6762-.0007-3.4601.2697-5.2444.2703-1.8384.8651-3.6776 1.8925-5.3538zm-10.381.433c-.3581.1194-.632.248-.8575.3805.2317-.1358.4996-.2666.8575-.3805zm.2101.1974c.2155.0025.4384.0734.6006.2357-.0067-.004-.0078-.0033-.0142-.0071.1331.0929.2666.2093.3932.3847-.2036.9673.2553 3.0317.0398 4.6694.0763 1.5485.0717 3.1804.849 4.4594-.9796-1.5107-1.176-3.4375-1.3218-5.236-.1128-1.0907-.2035-2.0969-.4642-2.9033-.144-.3047-.2684-.5745-.3833-.822-.0247-.0369-.0447-.0784-.071-.1135-.1082-.1082-.1619-.2696-.1619-.3777 0-.054.0539-.1618.108-.1618.054-.0541.1616-.0553.2157-.1094a1.013 1.013 0 0 1 .2101-.0184zm-1.3459.6133c-.0604.0201-.0923.041-.1405.061.1768-.034.3617.0339.5196.318-.1877.8916.4364 3.3685.4288 5.104.3124 1.8478.5496 3.8498 1.5716 5.1152C6.3723 11.5076 5.886 9.1286 5.5076 7.128 5.183 5.56 4.9125 4.2086 4.3718 3.776c-.054-.1081-.1079-.163-.1079-.2711 0-.1622-.0002-.3786.1079-.5949-.2772.6337-.4047 1.2673-.3706 1.901-.0445-.6487.0857-1.2905.3706-1.901 0-.054.054-.0538.054-.1079.012-.016.0314-.0349.044-.0511.0618-.0983.1308-.189.2257-.257.0557-.0615.0965-.1191.159-.1817-.0526.0555-.0872.1092-.1335.1647.0273-.018.0523-.0368.0838-.0525.1081-.1082.2154-.1633.3776-.1633zm-.3776.1633c-.0038.0075-.0076.0111-.0114.0184.0125-.0099.0242-.0208.037-.0298-.0074.0037-.0182.0077-.0256.0114zm14.7608 1.1343c-.0017.0052-.004.0104-.0057.0156.0378-.005.0751-.0173.1135-.0156-.0378-.0022-.0763.0103-.115.0199-.8634 2.6418-1.8874 5.2844-2.9118 7.9262a.0184.0184 0 0 1-.0015.0028c-.0874.4652-.234.8842-.5395 1.1898.4326-.4867.4854-1.1907.5395-2.0558.054-.811.0544-1.6761.487-2.5413 0-.0531.0012-.1058.0525-.159.0003-.0009.0012-.0019.0015-.0028.0973-.3524.202-.6885.3166-1.018.4183-1.2896 1.1396-3.1653 2.0131-3.3405.0163-.0052.034-.018.0497-.0213zM8.3726 16.2113l-.3238.1079c.1623.2163.2696.379.3777.433.1081.054.2168.108.379.108.0541 0 .1618 0 .2159-.054l.812-.2698c.0541 0 .1078-.054.1619-.054.1081 0 .1616 0 .2697.054l.2712.2698.2697-.054c-.1081-.1622-.2695-.3236-.3776-.3776-.1082-.0541-.2169-.1094-.379-.1094h-.108l-.866.3252h-.1618c-.1082 0-.2157 0-.2698-.054-.054-.054-.163-.1629-.2712-.3251zm-2.5953.541c-.2703.1621-.649.4324-1.1897.6487-.5407.2163-.9734.4325-1.1897.6488-.2163.2163-.3237.4326-.3237.6488 0 .1082.0537.1632.1618.2172.054.0541.1632.0539.2172.108.757.3244 1.5133.7019 2.2162 1.0803.1082.0541.2171.1632.2712.2173.054.054.1078.054.1618.054.1082 0 .2695-.0538.3777-.162.1081-.108.1632-.217.1632-.325 0-.1082-.055-.1618-.1632-.2158 0 0-.4328-.2165-1.1898-.541-.4866-.2162-.9179-.4326-1.1883-.5948.1623-.2704.486-.4865.9726-.7028.5407-.2163.9196-.4326 1.0818-.5948.054-.0541.054-.1078.054-.1619 0-.054-.0539-.1631-.108-.2172-.054-.054-.163-.1079-.2711-.1079zm11.247 0c-.054 0-.1618.0537-.2158.1078-.0541.1081-.1093.1632-.1093.2172v.054c.1622.1622.3797.2695.7041.3776.2704.054.5403.1632.8107.2172.3244.1082.5407.2693.6488.4856v.0553c0 .0541-.1088.1616-.3251.2698-.1082.054-.3245.2167-.5949.433-.2703.1622-.4326.3236-.5948.3776-.2163.1082-.3776.217-.4316.3252-.0541.054-.054.1077-.054.1618 0 .1081.0539.1077.108.2158.054.1081.1616.1093.2157.1093.054 0 .1078-.0554.1619-.0554.2703-.1622.6492-.3782 1.0818-.7567.4866-.3784.8655-.6484 1.0818-.8106.2163-.1082.3237-.2169.3237-.379 0-.0541.0002-.1618-.1079-.2159-.3785-.4325-.9185-.7022-1.5674-.9185-.1081-.0541-.2704-.1092-.5948-.1633-.1622-.054-.3249-.1079-.433-.1079zm-2.9743.8106c-.2704 0-.4866.055-.6488.2172-.2163.1622-.2699.4323-.2158.7567 0 .2703.1075.4865.2697.7027.1622.2163.3786.3252.5949.3252.1622 0 .2708-.0553.433-.1094.2703-.1622.379-.4319.379-.9185 0-.3785-.109-.6485-.2711-.8107-.1622-.1081-.3246-.1632-.541-.1632zm-4.4877.054c-.2704 0-.4866.055-.6488.2171-.2163.1622-.27.4323-.2158.7567 0 .2704.1075.4865.2697.7028s.3786.3251.5949.3251c.1622 0 .2708-.0552.433-.1093.2703-.1622.3776-.432.3776-.9186 0-.4325-.1075-.7025-.2697-.8106-.1622-.1082-.3247-.1633-.541-.1633zm0 .6501c.1622 0 .2711.1076.2711.2698 0 .1622-.163.2697-.2711.2697-.1622 0-.2698-.1075-.2698-.2697s.1076-.2698.2698-.2698zm4.3798.054c.1622 0 .2711.1075.2711.2697 0 .1082-.109.2698-.2711.2698-.1622 0-.2698-.1076-.2698-.2698 0-.1622.1076-.2697.2698-.2697zm-2.7032 2.1083l.1619.3237c.054.1081.1076.163.2158.2711.054.054.163.1619.2712.1619h.1078c.1082 0 .1618 0 .2158-.054.0541-.054.1632-.0538.2173-.1079l.1618-.1618c.054-.054.108-.1092.108-.1633.054-.054.0537-.1078.1078-.1618 0-.0541.054-.108.054-.108-.0541.1082-.1618.2156-.2158.3238-.1082.054-.1616.1632-.2698.1632-.1081.0541-.217.054-.3251.054s-.2157.0001-.2697-.054c-.1082 0-.1632-.0538-.2173-.1079l-.1618-.1632c-.054-.0541-.1078-.1618-.1619-.2158zm-.866 1.0278c-1.1355 0-1.8377 1.5136-3.4598.1619-.4326 2.6494 2.7583 2.866 4.11 1.7306.9192-.811.6475-1.9465-.6502-1.8925zm2.8664 0c-1.2977-.054-1.568 1.0815-.6488 1.8925 1.3518 1.1355 4.5412.9188 4.1087-1.7306-1.6221 1.3517-2.2703-.1619-3.4599-.1619z" />
          </svg>
        );
      case "AtCoder":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#555]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" />
          </svg>
        );
      case "HackerEarth":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#323754]" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.447 20.936H5.553V19.66h12.894zM20.973 0H9.511v6.51h.104c.986-1.276 2.206-1.4 3.538-1.306 1.967.117 3.89 1.346 4.017 5.169v7.322c0 .089-.05.177-.138.177h-2.29c-.09 0-.253-.082-.253-.177V10.6c0-1.783-.58-3.115-2.341-3.115-1.282 0-2.637.892-2.637 2.77v7.417c0 .089-.008.072-.102.072h-2.29c-.09 0-.29.022-.29-.072V0H3.178c-.843 0-1.581.673-1.581 1.515v20.996c0 .843.738 1.489 1.58 1.489h17.797c.843 0 1.431-.646 1.431-1.489V1.515c0-.842-.588-1.515-1.43-1.515" />
          </svg>
        );
      default:
        return <Link2 className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const mockPlatforms = [
    { name: "Code360" },
    { name: "InterviewBit" },
    { name: "HackerRank" },
    { name: "Codeforces" },
    { name: "CodeChef" },
    { name: "AtCoder" },
    { name: "HackerEarth" }
  ];

  return (
    <div className={`relative rounded-2xl border border-zinc-200 dark:border-white/[0.02] bg-white dark:bg-[#07070A]/90 px-4 py-4 overflow-hidden group hover:border-zinc-300 dark:hover:border-white/[0.05] transition-all duration-300 h-[522px] min-h-[522px] flex flex-col justify-between select-none ${!onboardingComplete ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.001)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.001)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.001)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.001)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Container wrapper for dynamic vertical distribution */}
      <div className="relative z-10 flex flex-col gap-4">
        
        {/* SECTION 1: Available Platforms */}
        <div className="flex flex-col gap-2.5 shrink-0">
          <div className="flex items-center justify-between border-b border-zinc-150 dark:border-white/[0.04] pb-2 shrink-0">
            <h3 className="text-[8.5px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-455 shrink-0" />
              Available Platforms
            </h3>
          </div>

          <div className="space-y-0.5">
            {(["LeetCode", "GeeksforGeeks"] as const).map((plat) => {
              const linkage = linkages[plat];
              const isLinked = !!linkage;
              const isVerified = linkage?.isVerified ?? false;

              if (isLinked) {
                return (
                  <div key={plat} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/[0.02] flex-nowrap w-full min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Platform Logo */}
                      <div className="w-5.5 h-5.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] flex items-center justify-center shrink-0">
                        {getPlatformLogo(plat)}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-250 tracking-wide truncate">{plat}</span>
                        <span className="text-[9px] text-zinc-500 font-mono truncate">@{linkage.username}</span>
                      </div>
                    </div>

                    {/* Status Action indicators */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                      {isVerified ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Premium Verified Seal Badge */}
                          <div className="flex items-center justify-center w-4.5 h-4.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full shrink-0 shadow-sm" title="Verified Connect">
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-emerald-400 fill-current" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                            </svg>
                          </div>
                          <a
                            href={getProfileUrl(plat, linkage.username)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-550 dark:hover:text-zinc-350 transition-colors p-0.5 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate("/settings?tab=platforms")}
                          className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full text-[8px] font-extrabold text-yellow-600 dark:text-yellow-405 select-none hover:bg-yellow-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
                        >
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Verify</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={plat}
                    onClick={() => navigate("/settings?tab=platforms")}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/[0.02] flex-nowrap w-full min-w-0 cursor-pointer group/item hover:bg-zinc-50 dark:hover:bg-white/[0.01] rounded-lg transition-all px-1"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Platform Logo */}
                      <div className="w-5.5 h-5.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] flex items-center justify-center shrink-0">
                        {getPlatformLogo(plat)}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 tracking-wide truncate">{plat}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-zinc-400 group-hover/item:text-amber-500 transition-colors shrink-0 uppercase tracking-widest select-none">
                      + Link
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* SECTION 2: Coming Soon Platforms */}
        <div className="flex flex-col gap-2 shrink-0">
          <h4 className="text-[8.5px] font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block border-b border-zinc-100 dark:border-white/[0.02] pb-1.5 px-0.5 select-none">
            Coming Soon
          </h4>
          <div className="space-y-0.5">
            {mockPlatforms.map((mockPlat) => (
              <div key={mockPlat.name} className="flex items-center justify-between py-1.5 px-0.5 select-none transition-all">
                <div className="flex items-center gap-2.5 transition-all duration-300">
                  <div className="w-5.5 h-5.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.02] flex items-center justify-center shrink-0">
                    {getPlatformLogo(mockPlat.name)}
                  </div>
                  <span className="text-[10.5px] font-bold text-zinc-700 dark:text-zinc-300 tracking-wide">{mockPlat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Development Platforms */}
        <div className="flex flex-col gap-2 shrink-0">
          <h4 className="text-[8.5px] font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block border-b border-zinc-100 dark:border-white/[0.02] pb-1.5 px-0.5 select-none">
            Development
          </h4>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between py-1.5 px-0.5 select-none transition-all">
              <div className="flex items-center gap-2.5 transition-all duration-300">
                <div className="w-5.5 h-5.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.02] flex items-center justify-center shrink-0">
                  {getPlatformLogo("GitHub")}
                </div>
                <span className="text-[10.5px] font-bold text-zinc-700 dark:text-zinc-300 tracking-wide">GitHub</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
