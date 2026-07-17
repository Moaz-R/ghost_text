#include <iostream>
#include <string>
#include <bitset>
#include <sstream>
#include <fstream>
using namespace std;
int main()
{
    int choice;
    cout << "=== GhostText Tool ===" << endl;
    cout << "[1] Hide a secret message (Encode)" << endl;
    cout << "[2] Extract a secret message (Decode)" << endl;
    cout << "Enter your choice (1 or 2): ";
    cin >> choice;
    cin.ignore();
    if (choice == 1)
    {
        string cover_text, secret_text;
        cout << "Enter the cover text: ";
        getline(cin, cover_text);
        cout << "\nEnter the secret message: ";
        getline(cin, secret_text);
        string binary_secret = "";
        for (int i = 0; i < secret_text.size(); i++)
        {
            binary_secret += bitset<8>(secret_text[i]).to_string();
        }
        string hidden_payload = "";
        for (auto x : binary_secret)
        {
            if (x == '0')
            {
                hidden_payload += "\xE2\x80\x8B";
            }
            else
            {
                hidden_payload += "\xE2\x80\x8C";
            }
        }
        string final_result = cover_text + hidden_payload;
        ofstream outFile("output.txt");

        if (outFile.is_open())
        {
            outFile << final_result;
            outFile.close();
            cout << "\n[Success] The hidden message has been saved to 'output.txt'!" << endl;
        }
        else
        {
            cout << "\n[Error] Could not create the file!" << endl;
        }
    }
    else if (choice == 2)
    {
        cout << "\nreading file..." << endl;

        ifstream f("output.txt");

        if (!f.is_open())
        {
            cout << "file not found!" << endl;
            return 1;
        }

        // نقرأ الملف كله
        stringstream ss;
        ss << f.rdbuf();
        string el_nass = ss.str();
        f.close();

        string binData = "";

        // ندور على الحروف الشفافة
        for (int i = 0; i < el_nass.length();)
        {
            if (i + 2 < el_nass.length() &&
                (unsigned char)el_nass[i] == 0xE2 &&
                (unsigned char)el_nass[i + 1] == 0x80 &&
                (unsigned char)el_nass[i + 2] == 0x8B)
            {
                binData += "0";
                i += 3;
            }
            else if (i + 2 < el_nass.length() &&
                     (unsigned char)el_nass[i] == 0xE2 &&
                     (unsigned char)el_nass[i + 1] == 0x80 &&
                     (unsigned char)el_nass[i + 2] == 0x8C)
            {
                binData += "1";
                i += 3;
            }
            else
            {
                i++;
            }
        }

        if (binData == "")
        {
            cout << "mfeesh secret hna!" << endl;
        }
        else
        {
            cout << "\nfound binary! decoding..." << endl;

            string el_ser = "";
            for (int i = 0; i < binData.length(); i += 8)
            {
                string b = binData.substr(i, 8);
                char c = char(bitset<8>(b).to_ulong());
                el_ser += c;
            }

            cout << "\n-----------------------" << endl;
            cout << "Secret is: " << el_ser << endl;
            cout << "-----------------------" << endl;
        }
    }
    return 0;
}