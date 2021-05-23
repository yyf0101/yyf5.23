 function randomNum(maxNum, minNum, decimalNum) {
            var max = 0, min = 0;
            minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
            switch (arguments.length) {
                case 1:
                    return Math.floor(Math.random() * (max + 1));
                    break;
                case 2:
                    return Math.floor(Math.random() * (max - min + 1) + min);
                    break;
                case 3:
                    return (Math.random() * (max - min) + min).toFixed(decimalNum);
                    break;
                default:
                    return Math.random();
                    break;
            }
        }

        var str = "";
        var err = 0;
        for (var i = 11; i < 19; i++) {
            t = randomNum(6, i);
            if (t < 6 || t > 15)
                err++;
            str += t;
            if (i % 2 == 0) {
                str += '\r';
            }
            else
                str += '==';
        }
        alert(err + "\r" + str);