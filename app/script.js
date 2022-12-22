const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

var fileName = process.argv[2];
const rs = fs.createReadStream(fileName, {encoding: "utf8"});
const rl = readline.createInterface({ input: rs });

let arr=[];

rl.on('line', (line) => {
    arr.push(line);
});

fs.mkdir('cap', (err) => {
    if (err) {
        console.log(err.toString());
        return;
    }
});

async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  
  for (const data of arr) {
  
    var retry = 0;
  
    while(1) {
      try {
        
        const splt = data.split(',');
        console.log(splt[0]);
        console.log(splt[1]);
        
        var aaa = splt[0];
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
        await page.setDefaultNavigationTimeout(60000);
        
        await page.goto(aaa, { waitUntil: ['load', 'domcontentloaded', 'networkidle2'] });
        
        await sleep(500);
        
        await page.screenshot({ path: './cap/' + splt[1] + '.jpg', fullPage: true });
        await page.close();
        break;
        
      } catch (err) {
        console.log(err.name + ': ' + err.message);
        await sleep(1000);
        if (retry == 5) {
          break;
        }
        retry++;
      }
    }
  }
  
  browser.close();
})();