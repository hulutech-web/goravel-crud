export default class RandomColor {
    length: number
    hslArray: number[][]
    constructor(length: number) {
        this.length = length
        this.hslArray = this.getHslArray()
    }
    // 获取随机HSL
    randomHsl(): number[] {
        const H = Math.random()
        const S = Math.random()
        const L = Math.random()
        return [H, S, L];
    }

    // 获取HSL数组
    getHslArray(): number[][] {
        let HSL: number[][] = []
        const hslLength = this.length; // 获取数量
        for (let i = 0; i < hslLength; i++) {
            let ret = this.randomHsl();

            // 颜色相邻颜色差异须大于 0.25
            if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
                i--;
                continue; // 重新获取随机色
            }
            ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
            ret[2] = 0.4 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色

            // 数据转化到小数点后两位
            ret = ret.map((item) => {
                return parseFloat(item.toFixed(2));
            });
            // console.log('ret', ret);


            HSL.push(ret);
        }
        return HSL;
    }

    /**
     * HSL颜色值转换为RGB
     * H，S，L 设定在 [0, 1] 之间
     * R，G，B 返回在 [0, 255] 之间
     * @param H 色相
     * @param S 饱和度
     * @param L 亮度
     * @returns Array RGB色值
     */
    hslToRgb(H: number, S: number, L: number): number[] {
        let R, G, B;
        if (+S === 0) {
            R = G = B = L; // 饱和度为0 为灰色
        } else {
            const hue2Rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
            const P = 2 * L - Q;
            R = hue2Rgb(P, Q, H + 1 / 3);
            G = hue2Rgb(P, Q, H);
            B = hue2Rgb(P, Q, H - 1 / 3);
        }
        return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
    }
    // 合成rgb
    get rgbArray(): {} {
        // console.log('hslArray', this.hslArray);
        if (!this.hslArray.length) return []
        const rgbArray1 = this.hslArray.map(v => {
            const [H, S, L] = v
            return this.hslToRgb(H, S, L)
        })
        return rgbArray1.map(v => {
            return {
                color: `rgb(${v.toString()})`
            }
        })
    }
}
